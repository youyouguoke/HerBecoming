"use client";

export function CrisisPanel() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-margin-mobile py-xl">
      <main className="w-full max-w-[800px] flex flex-col gap-xl text-center">
        <section className="flex flex-col gap-md">
          <h2 className="font-display text-display text-on-surface">You don&apos;t have to handle this alone.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[600px] mx-auto">
            If you are feeling overwhelmed, unsafe, or in crisis, there are people ready to listen and help right now. Reaching out is the bravest first step.
          </p>
        </section>
        <section className="flex flex-col gap-md">
          <h3 className="font-headline-lg text-headline-lg border-b border-surface-variant pb-sm text-left">Get immediate support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md text-left">
            <div className="bg-surface-container-low p-lg rounded-xl border border-surface-variant">
              <h4 className="font-headline-md text-headline-md text-on-surface">National Crisis Lifeline</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">24/7, free and confidential support for people in distress.</p>
              <a href="tel:988" className="mt-md inline-flex items-center justify-center w-full bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-full hover:opacity-90 transition-opacity">
                Call 988
              </a>
            </div>
            <div className="bg-surface-container-low p-lg rounded-xl border border-surface-variant">
              <h4 className="font-headline-md text-headline-md text-on-surface">Crisis Text Line</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Connect with a volunteer Crisis Counselor 24/7.</p>
              <a href="sms:741741" className="mt-md inline-flex items-center justify-center w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-sm px-md rounded-full hover:bg-primary-fixed-dim transition-colors">
                Text HOME to 741741
              </a>
            </div>
            <div className="bg-surface-container-low p-lg rounded-xl border border-surface-variant md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-md">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">Emergency Services</h4>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">If you are in immediate physical danger or need urgent medical attention.</p>
              </div>
              <a href="tel:911" className="inline-flex items-center justify-center whitespace-nowrap bg-error text-on-error font-label-md text-label-md py-sm px-xl rounded-full hover:opacity-90 transition-opacity min-w-[200px]">
                Call 911
              </a>
            </div>
          </div>
        </section>
        <p className="font-body-md text-body-md text-on-surface-variant italic">
          Please remember that seeking help is a sign of strength. Take a deep breath, and connect with someone who can support you.
        </p>
      </main>
    </div>
  );
}
