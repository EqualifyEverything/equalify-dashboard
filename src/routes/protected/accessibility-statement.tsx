import { SEO } from '~/components/layout';

const AccessibilityStatement = () => {
  return (
    <>
      <SEO
        title="Accessibility Statement - Equalify"
        description="Equalify Accessibility Statement."
        url="https://dashboard.equalify.app/accessibility"
      />
      <div className="w-8/12 mx-auto">
        <h1
          id="accessibility-heading"
          className="text-2xl font-bold md:text-3xl"
        >
          Equalify Accessibility Statement
        </h1>
        <section aria-labelledby="general-info-heading" className="mt-7 space-y-6 rounded-lg bg-white p-6 shadow">
        <h2 className="font-bold">How Can We Help?</h2>
        <p>
          We welcome any comments, questions, or feedback on our site. If you
          notice aspects of our site that aren’t working for you or your
          assistive technology, email <a href="mailto:support@equalify.app" className='text-[#186121] underline underline-offset-4 pl-1'>support@equalify.app</a>.
        </p>
        <h2 className="font-bold">Equalify is Committed to Digital Accessibility</h2>
        <p>
          This project is committed to delivering an excellent user experience
          for everyone. Equalify's user interface is structured in a way that
          allows those of all abilities to easily and quickly find the
          information they need.
        </p>
        <h2 className="font-bold">Ongoing Efforts to Ensure Accessible Content</h2>
        <p>
          Equalify uses the Web Content Accessibility Guidelines (WCAG) version
          2.2 as its guiding principle. As we develop new pages and
          functionality, the principles of accessible design and development are
          an integral part of conception and realization.
        </p>
        <p>
          We continually test content and features for WCAG 2.2 Level AA
          compliance and remediate any issues to ensure we meet or exceed the
          standards. Testing of our digital content is performed by our
          accessibility experts using automated testing software, screen
          readers, a color contrast analyzer, and keyboard-only navigation
          techniques.
        </p>
        <h2 className="font-bold">Summary of Accessibility Features</h2>
        <ul className="list-disc list-inside">
          <li>
            All images and other non-text elements have alternative text
            associated with them.
          </li>
          <li>Navigational aids are provided on all app pages. </li>
          <li>
            Structural markup to indicate headings and lists has been provided
            to aid in page comprehension
          </li>
          <li>
            Forms are associated with labels and instructions on filling in
            forms are available to screen reader users
          </li>
        </ul>

        <h2 className="font-bold">Project VPATs</h2>
        <p>
          To request a conformance report using the Voluntary Product
          Accessibility Template (VPAT), please email 
          <a href="mailto:support@equalify.app" className='text-[#186121] underline underline-offset-4 pl-1'>support@equalify.app</a>.
        </p>
        </section>
      </div>
    </>
  );
};

export default AccessibilityStatement;
