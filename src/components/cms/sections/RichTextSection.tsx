import React from "react";
import DOMPurify from "isomorphic-dompurify";

interface RichTextSectionProps {
  data: {
    title?: string;
    content: string;
  };
}

export function RichTextSection({ data }: RichTextSectionProps) {
  const sanitizedHtml = DOMPurify.sanitize(data.content || "");

  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        {data.title && (
          <div className="border-b border-border pb-4">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              {data.title}
            </h1>
          </div>
        )}

        <div
          className="prose prose-sm sm:prose-base dark:prose-invert text-muted-foreground leading-relaxed max-w-none prose-headings:text-foreground prose-headings:font-bold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </div>
    </section>
  );
}
