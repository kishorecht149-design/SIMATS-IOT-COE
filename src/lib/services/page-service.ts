import connectToDatabase from "@/lib/db/mongodb";
import Page, { IPage, PageRevision, IPageRevision } from "@/models/Page";
import { DEFAULT_PAGES, DefaultPageConfig } from "@/lib/cms/default-pages";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "@/lib/services/audit-service";

export async function getPage(slug: string): Promise<DefaultPageConfig | null> {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return DEFAULT_PAGES[slug] || null;
    }

    const pageDoc = await Page.findOne({ slug: slug.toLowerCase() }).lean();
    if (pageDoc && pageDoc.sections && pageDoc.sections.length > 0) {
      return {
        slug: pageDoc.slug,
        title: pageDoc.title,
        metaDescription: pageDoc.metaDescription || "",
        sections: pageDoc.sections.map((s: any) => ({
          id: s.id,
          type: s.type,
          enabled: s.enabled ?? true,
          order: s.order ?? 0,
          data: s.data || {},
        })),
      };
    }
  } catch (error) {
    // Fallback cleanly
  }

  if (DEFAULT_PAGES[slug]) {
    return DEFAULT_PAGES[slug];
  }

  return null;
}

export async function getAllPages() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return Object.values(DEFAULT_PAGES).map((p) => ({
        slug: p.slug,
        title: p.title,
        metaDescription: p.metaDescription,
        status: "published",
        sectionCount: p.sections.length,
        updatedAt: new Date(),
      }));
    }

    const dbPages = await Page.find().lean();
    const dbPagesMap = new Map(dbPages.map((p) => [p.slug, p]));
    const allSlugs = Array.from(new Set([...Object.keys(DEFAULT_PAGES), ...dbPages.map((p) => p.slug)]));

    return allSlugs.map((slug) => {
      const dbPage = dbPagesMap.get(slug);
      const defaultPage = DEFAULT_PAGES[slug];

      return {
        slug,
        title: dbPage?.title || defaultPage?.title || slug,
        metaDescription: dbPage?.metaDescription || defaultPage?.metaDescription || "",
        status: dbPage?.status || "published",
        sectionCount: dbPage?.sections?.length || defaultPage?.sections?.length || 0,
        updatedAt: dbPage?.updatedAt || new Date(),
      };
    });
  } catch (error) {
    return Object.values(DEFAULT_PAGES).map((p) => ({
      slug: p.slug,
      title: p.title,
      metaDescription: p.metaDescription,
      status: "published",
      sectionCount: p.sections.length,
      updatedAt: new Date(),
    }));
  }
}

export async function savePage(
  slug: string,
  payload: {
    title: string;
    metaDescription?: string;
    sections: any[];
    status?: "draft" | "published";
  },
  userId?: string,
  userEmail?: string
) {
  const conn = await connectToDatabase();
  if (!conn) {
    DEFAULT_PAGES[slug] = {
      slug,
      title: payload.title,
      metaDescription: payload.metaDescription || "",
      sections: payload.sections,
    };
    revalidatePath(`/${slug === "home" ? "" : slug}`);
    revalidatePath("/admin/pages");
    return DEFAULT_PAGES[slug];
  }

  let page = await Page.findOne({ slug: slug.toLowerCase() });

  if (!page) {
    page = new Page({
      slug: slug.toLowerCase(),
      title: payload.title,
      metaDescription: payload.metaDescription || "",
      sections: payload.sections,
      status: payload.status || "published",
      version: 1,
    });
  } else {
    await PageRevision.create({
      pageId: page._id,
      slug: page.slug,
      version: page.version,
      sections: page.sections,
      updatedBy: userId,
      note: `Auto-snapshot prior to v${page.version + 1}`,
    });

    page.title = payload.title;
    page.metaDescription = payload.metaDescription || "";
    page.sections = payload.sections;
    page.status = payload.status || "published";
    page.version = (page.version || 1) + 1;
    page.publishedAt = new Date();
  }

  await page.save();

  if (userEmail) {
    await recordAuditLog({
      userId,
      userEmail,
      action: "PAGE_UPDATED",
      targetEntity: "Page",
      targetId: page._id.toString(),
      diff: { slug, title: payload.title, sectionsCount: payload.sections.length },
    });
  }

  revalidatePath(`/${slug === "home" ? "" : slug}`);
  revalidatePath("/admin/pages");

  return page;
}

export async function getPageRevisions(slug: string) {
  try {
    const conn = await connectToDatabase();
    if (!conn) return [];
    return await PageRevision.find({ slug: slug.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
  } catch (error) {
    return [];
  }
}
