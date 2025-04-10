import { FC } from 'react';
import { Card, CardContent } from '@/components/card';
import { ScrollArea } from '@/components/scrollArea';

const PrivacyPolicyPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-gray-700 text-sm leading-6">
              <p>
                Your privacy is important to us. It is our policy to respect
                your privacy regarding any information we may collect from you
                through our app.
              </p>
              <p>
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent.
              </p>
              <p>
                We also collect some non-personal data to improve the app, such
                as usage statistics and crash reports.
              </p>
              <p>
                We don’t share any personally identifying information publicly
                or with third-parties, except when required to by law.
              </p>
              <p>
                Our app may link to external sites that are not operated by us.
                Please be aware that we have no control over the content and
                practices of these sites.
              </p>
              <p>
                You are free to refuse our request for your personal
                information, with the understanding that we may be unable to
                provide some of your desired services.
              </p>
              <p>
                Your continued use of our app will be regarded as acceptance of
                our practices around privacy and personal information.
              </p>
              <p>
                If you have any questions about how we handle user data and
                personal information, feel free to contact us.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
