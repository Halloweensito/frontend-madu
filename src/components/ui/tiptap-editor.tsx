import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface TiptapEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) => (
    <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        disabled={disabled}
        className={cn('h-8 w-8 p-0', isActive && 'bg-muted text-foreground')}
        title={title}
    >
        {children}
    </Button>
);

const TiptapToolbar = ({ editor }: { editor: Editor }) => {
    if (!editor) return null;

    return (
        <div className="border-b bg-muted/40 p-1 flex flex-wrap gap-1 sticky top-0 z-10">
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="Align Left"
            >
                <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="Align Center"
            >
                <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="Align Right"
            >
                <AlignRight className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1 self-center" />

            <ToolbarButton
                onClick={() => {
                    const previousUrl = editor.getAttributes('link').href;
                    const url = window.prompt('URL', previousUrl);
                    if (url === null) return;
                    if (url === '') {
                        editor.chain().focus().extendMarkRange('link').unsetLink().run();
                        return;
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }}
                isActive={editor.isActive('link')}
                title="Link"
            >
                <LinkIcon className="h-4 w-4" />
            </ToolbarButton>

            <div className="flex-1" />

            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
};

export default function TiptapEditor({
    value,
    onChange,
    className,
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4',
                },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    'min-h-[200px] w-full rounded-md border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose  prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sincronizar contenido externo si cambia drásticamente (ej: carga inicial)
    // Nota: Esto puede causar problemas de cursor si no se maneja con cuidado.
    // Solo actualizamos si el contenido es diferente y el editor no está enfocado o está vacío.
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Comparación simple para evitar bucles.
            // Idealmente solo setContent si está vacío o si es la carga inicial.
            // Como estamos usando react-hook-form con controller, el value inicial viene bien.
            // Pero si cambia externamente, lo actualizamos.
            if (editor.getText() === '' && value) {
                editor.commands.setContent(value);
            }
        }
    }, [value, editor]);

    return (
        <div className={cn('border rounded-md overflow-hidden bg-background', className)}>
            {editor && <TiptapToolbar editor={editor} />}
            <EditorContent editor={editor} className="p-2" />
        </div>
    );
}
