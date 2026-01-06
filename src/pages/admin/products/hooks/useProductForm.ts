// hooks/useProductForm.ts
// Hook personalizado que encapsula toda la lógica del formulario de productos

import { useRef, useMemo, useState, type RefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { logger } from "@/utils/logger";

import {
    useAttributes,
    useCategories,
    useCreateProduct,
    useUpdateProduct,
    useProductById
} from "@/hooks/useCatalog";
import type { ProductFormData, ImageRequest, CategoryResponse, Attribute, ProductResponse } from "@/types/types";
import { productFormSchema } from "@/schemas/productForm";
import {
    defaultProductValues,
    mapProductToFormData,
    mapFormToPayload
} from "../utils/product-helpers";
import { mergeImages, mapVariantsWithFinalImages } from "../utils/product-image-utils";
import type { ImageUploadHandle } from "../ImageUpload";

export interface UseProductFormReturn {
    // Form
    form: UseFormReturn<ProductFormData>;

    // Mode
    isEditMode: boolean;
    productId: number | undefined;

    // Data
    categories: CategoryResponse[] | undefined;
    isLoadingCategories: boolean;
    categoriesError: Error | null;

    globalAttributes: Attribute[];
    isLoadingAttributes: boolean;
    attributesError: Error | null;

    existingProduct: ProductResponse | undefined;
    isLoadingProduct: boolean;
    productError: Error | null;

    // Form values (watched)
    attributesConfig: ProductFormData["attributesConfig"];
    defaultPrice: number;
    defaultStock: number;
    initialVariants: ProductFormData["variants"] | undefined;

    // State
    isSubmitting: boolean;

    // Refs
    imageUploadRef: RefObject<ImageUploadHandle | null>;

    // Handlers
    onSubmit: (data: ProductFormData) => Promise<void>;
    getGeneralImages: () => ImageRequest[];
    handleFormKeyDown: (e: React.KeyboardEvent<HTMLFormElement>) => void;
    navigateBack: () => void;
}

export function useProductForm(): UseProductFormReturn {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isEditMode = !!id;
    const productId = id ? Number(id) : undefined;

    // Data fetching
    const {
        data: categories,
        isLoading: isLoadingCategories,
        error: categoriesError
    } = useCategories();

    const {
        data: globalAttributes = [],
        isLoading: isLoadingAttributes,
        error: attributesError
    } = useAttributes();

    const {
        data: existingProduct,
        isLoading: isLoadingProduct,
        error: productError
    } = useProductById(productId);

    // Mutations
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
    const isSubmitting = isSubmittingLocal || createMutation.isPending || updateMutation.isPending;

    // Refs
    const imageUploadRef = useRef<ImageUploadHandle | null>(null);

    // Memoize form values from existing product
    const formValues = useMemo(() => {
        if (isEditMode && existingProduct) {
            return mapProductToFormData(existingProduct);
        }
        return undefined;
    }, [isEditMode, existingProduct]);

    // Form setup
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema as any),
        defaultValues: defaultProductValues,
        values: formValues,
        resetOptions: {
            keepDirtyValues: true,
        },
        mode: "onSubmit",
    });

    // Watched values
    const initialVariants = useMemo(() => {
        return existingProduct ? mapProductToFormData(existingProduct).variants : undefined;
    }, [existingProduct]);

    const attributesConfig = useWatch({
        control: form.control,
        name: "attributesConfig",
    });

    const defaultPrice = useWatch({
        control: form.control,
        name: "defaultPrice",
    }) || 0;

    const defaultStock = useWatch({
        control: form.control,
        name: "defaultStock",
    }) || 0;

    // Helper functions
    const getGeneralImages = (): ImageRequest[] =>
        mergeImages(form.watch("images") || [], imageUploadRef.current?.getPreviews() || []);

    const navigateBack = () => navigate("/admin/productos");

    // Form submit handler
    const onSubmit = async (data: ProductFormData) => {
        if (isSubmitting) return;

        setIsSubmittingLocal(true);

        try {
            let finalImages = data.images || [];
            let variantsWithUpdatedImages = data.variants || [];

            if (imageUploadRef.current?.hasPreviews()) {
                finalImages = await imageUploadRef.current.uploadPreviews();
                form.setValue("images", finalImages);

                variantsWithUpdatedImages = mapVariantsWithFinalImages(data.variants || [], finalImages);

                if (variantsWithUpdatedImages.length > 0) {
                    form.setValue("variants", variantsWithUpdatedImages, { shouldValidate: false, shouldDirty: false });
                }
            }

            const dataWithUpdatedVariants = { ...data, variants: variantsWithUpdatedImages };
            const payload = mapFormToPayload(dataWithUpdatedVariants, finalImages);

            if (isEditMode && productId) {
                await updateMutation.mutateAsync({ id: productId, data: payload });
                toast.success("Producto actualizado exitosamente");
            } else {
                await createMutation.mutateAsync(payload);
                toast.success("Producto creado exitosamente");
            }

            navigate("/admin/productos");
        } catch (error) {
            logger.error("Error submitting product:", error);
            toast.error("Error al guardar el producto");
            form.setError("root", {
                message: "Error al guardar el producto. Intenta nuevamente."
            });
            setIsSubmittingLocal(false);
        }
    };

    // Keyboard handler
    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key !== "Enter") return;
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const tag = (target.tagName || "").toLowerCase();

        if (tag === "textarea") return;
        if (tag === "button") return;
        if (tag === "input") {
            const inputType = (target as HTMLInputElement).type?.toLowerCase();
            if (inputType === "submit" || inputType === "button") return;
        }

        e.preventDefault();
    };

    return {
        form,
        isEditMode,
        productId,
        categories,
        isLoadingCategories,
        categoriesError,
        globalAttributes,
        isLoadingAttributes,
        attributesError,
        existingProduct,
        isLoadingProduct,
        productError,
        attributesConfig,
        defaultPrice,
        defaultStock,
        initialVariants,
        isSubmitting,
        imageUploadRef,
        onSubmit,
        getGeneralImages,
        handleFormKeyDown,
        navigateBack,
    };
}
