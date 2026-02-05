// JSON-LD Schema Types for SEO
// Using flexible types to support all Schema.org schemas

interface BaseSchema {
  "@context": "https://schema.org";
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
}

interface JsonLdProps {
  data: BaseSchema | BaseSchema[] | Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  // Handle both single schema and array of schemas
  const schemaData = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemaData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
