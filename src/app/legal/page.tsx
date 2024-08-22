export default async function PrivacyPolicyPage() {
  return (
    <main className="flex flex-1 flex-col gap-10 p-4">
      <section>
        <h1 id="disclaimer" className="text-2xl font-bold">
          Fliekie Disclaimer
        </h1>
        <p className="mb-4">
          This application uses TMDB and the TMDB APIs but is not endorsed,
          certified, or otherwise approved by TMDB.
        </p>
      </section>

      <section>
        <h1 id="privacy-policy" className="text-2xl font-bold">
          Fliekie Privacy Policy
        </h1>
        <p className="mb-4">
          At Fliekie, we are committed to protecting your privacy. This Privacy
          Policy outlines how we collect, use, and protect your information when
          you use our app.
        </p>

        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p className="mb-4">
          We may collect the following types of information:
        </p>
        <ul className="mb-4 ml-6 list-disc">
          <li>
            <strong>Personal Information:</strong> When you sign up or log in
            using your social media accounts or email, we collect your name,
            email address, and profile information.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect data on how you use the app,
            including the movies you watch, your preferences, and any
            interactions with other users.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <p className="mb-4">
          The information we collect is used to provide and improve our
          services. Specifically, we may use your data to:
        </p>
        <ul className="mb-4 ml-6 list-disc">
          <li>Personalize your experience on the app.</li>
          <li>Recommend movies based on your preferences.</li>
          <li>
            Facilitate interactions with other users, such as following or
            sharing movie lists.
          </li>
          <li>Send you notifications and updates related to the app.</li>
        </ul>

        <h2 className="text-xl font-semibold">Data Sharing and Security</h2>
        <p className="mb-4">
          We do not share your personal information with third parties, except
          as necessary to provide our services or as required by law. We
          implement industry-standard security measures to protect your data
          from unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p className="mb-4">
          You have the right to access, correct, or delete your personal data.
          If you have any questions or requests regarding your data, please wait
          around until I create an actual contact form for this.
        </p>

        <h2 className="text-xl font-semibold">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we will notify you if the changes are
          significant.
        </p>

        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy, you
          can wait around until I create an actual contact form for this.
        </p>
      </section>
    </main>
  );
}
