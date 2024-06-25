import languages from "@/config/language.json";
import { getListPage } from "@/lib/contentParser";
import { getActiveLanguages } from "@/lib/languageParser";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";
import path from "path";


// remove dynamicParams
export const dynamicParams = false;

// generate static params
export async function generateStaticParams() {
  return getActiveLanguages().map((language) => ({
    lang: language.languageCode,
  }));
}

const Home = ({ params }: { params: { lang: string } }) => {
  const lang = params.lang;
  const language = languages.find(
    (language) => language.languageCode === lang,
  )!;
  const homepage = getListPage(
    path.join(language?.contentDir, "homepage/_index.md"),
  );
  const { frontmatter } = homepage;

  return (
    <>
      <SeoMeta />
      <section className="section pt-14">
        <div className="container">
          <div className="mt-10 row justify-center">
            <div className="lg:col-7 md:col-9 mb-8 text-center">
              <h1
                className="mb-4 text-h3 lg:text-h1"
                dangerouslySetInnerHTML={markdownify(
                  "Forecasting Hotel Occupancy at Jowhara International Hotel",
                )}
              />
              <p
                className="mb-8"
                dangerouslySetInnerHTML={markdownify(
                  "Predicting Check-In and Check-Out Patterns with Advanced Machine Learning Models" ??
                    "",
                )}
              />
              <Link className="btn btn-primary" href={"/check-in-check-out"}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
