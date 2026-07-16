export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalDocumentProps = {
  title: string;
  updatedLabel: string;
  updatedAt: string;
  introduction: string;
  sections: LegalSection[];
};

export function LegalDocument({
  title,
  updatedLabel,
  updatedAt,
  introduction,
  sections,
}: LegalDocumentProps) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <header className="mb-10 space-y-4 border-b pb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {updatedLabel}: {updatedAt}
        </p>
        <p className="text-base leading-7 text-muted-foreground">{introduction}</p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="leading-7 text-muted-foreground">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="leading-7">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
