import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getActiveLanguages, getLanguageObj } from "@/lib/languageParser";

import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { RegularPage } from "@/types";
import path from "path";
import PageHeader from "@/partials/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";

const About = ({ params }: { params: { lang: string } }) => {
  const language = getLanguageObj(params.lang);
  const data: RegularPage = getListPage(
    path.join(language.contentDir, "about/_index.md"),
  );
  const { frontmatter, content } = data;
  const { title, meta_title, description, image } = frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={"About Us"}>
        <Breadcrumbs lang={params.lang} />
      </PageHeader>
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="space-y-10">
              <div className="text-center space-y-2">
                <h2>Our Story</h2>
                <p>
                  Founded in the heart of Mogadishu , Jowhara International
                  Hotel has been a beacon of luxury and comfort since 2015. Our
                  journey began with a vision to provide exceptional hospitality
                  services, blending modern amenities with a touch of
                  traditional charm. Over the years, we have grown to become a
                  preferred destination for travelers from around the globe,
                  known for our warm welcome and personalized service.
                </p>
              </div>

              <div className="text-center space-y-2">
                <h2>Mission Statement</h2>
                <p>
                  Our mission is to deliver unparalleled hospitality experiences
                  that exceed our guests' expectations. We are dedicated to
                  creating a home away from home, where every guest feels valued
                  and cared for.
                </p>
              </div>
              <div className="text-center space-y-2">
                <h2>Vision Statement</h2>
                <p>
                  Our vision is to be the leading hotel in Mogadishu, renowned
                  for our commitment to excellence, innovation, and sustainable
                  practices. We strive to set new standards in the hospitality
                  industry, providing our guests with memorable stays and
                  enriching experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export async function generateStaticParams() {
  return getActiveLanguages().map((language) => ({
    lang: language.languageCode,
  }));
}
