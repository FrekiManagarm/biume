"use client";

import { BookerEmbed } from "@calcom/atoms";
// import "@calcom/atoms/globals.min.css";

const DemoClientPage = () => {
  return (
    <div>
      <BookerEmbed
        eventSlug="point-presentation"
        view="MONTH_VIEW"
        username="mathieu-chambaud-biume"
        hideBranding={true}
        userLocale="fr-FR"
        onCreateBookingSuccess={() => {
          console.log("booking created successfully");
        }}
      />
    </div>
  );
};

export default DemoClientPage;
