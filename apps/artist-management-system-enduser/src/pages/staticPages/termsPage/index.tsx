import { FC } from 'react';
import { Card, CardContent } from '@/components/card';
import { ScrollArea } from '@/components/scrollArea';

const TermsPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-gray-700 text-sm leading-6">
              <p>
                Welcome to our app! These terms and conditions outline the rules
                and regulations for the use of our service.
              </p>
              <p>
                By accessing this app, we assume you accept these terms and
                conditions. Do not continue to use the app if you do not agree
                to take all of the terms and conditions stated on this page.
              </p>
              <p>
                The following terminology applies to these Terms and Conditions,
                Privacy Statement, and Disclaimer Notice and all Agreements:
                “Client”, “You” and “Your” refers to you, the person log on this
                app and compliant to the Company’s terms and conditions.
              </p>
              <p>
                We reserve the right to modify these terms at any time. You
                should check this page regularly. Your continued use of the
                website after changes are posted constitutes your acceptance of
                the modified terms.
              </p>
              <p>
                If you have any questions about these Terms, please contact us.
              </p>
              <p>Thank you for using our app.</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
