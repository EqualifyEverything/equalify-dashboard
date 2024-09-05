import { MaxWidthWrapper } from '.';

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 bg-white max-md:py-3">
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center gap-3 text-sm text-slate-500 md:h-16 md:gap-0 md:text-base">

          <nav aria-label="Footer Links">
            <ul className="flex justify-center gap-4">
              <li>
                <a
                  href="https://github.com/equalifyEverything/v1/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Report an Issue"
                  aria-label="Report an Issue on GitHub"
                  className="text-sm font-medium text-[#186121] underline underline-offset-8 hover:text-[#186121CC]"
                >
                  Report an Issue
                  <span className="sr-only">(Opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="/accessibility/"
                  title="Accessibility Statement"
                  aria-label="Read the Accessibility Statement"
                  className="text-sm font-medium text-[#186121] underline underline-offset-8 hover:text-[#186121CC]"
                >
                  Accessibility Statement
                  <span className="sr-only">(Opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
