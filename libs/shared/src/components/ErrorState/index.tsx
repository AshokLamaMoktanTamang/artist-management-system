import { FC } from 'react';
import { Link } from 'react-router-dom';

export enum ErrorStateType {
  PAGENOTEXIST = 'Page-not-found',
  SERVERERROR = 'Server-error',
}

export interface ErrorStateProps {
  type?: ErrorStateType;
  homeRoutePath?: string;
}

const ErrorState: FC<ErrorStateProps> = ({
  type = ErrorStateType.PAGENOTEXIST,
  homeRoutePath,
}) => {
  const contents = [
    {
      type: ErrorStateType.PAGENOTEXIST,
      text: 'System is Hibernating! 💤',
    },
    {
      type: ErrorStateType.SERVERERROR,
      text: "Oops! System's Taking a Break! 🌿",
    },
  ];

  const contentToUse = contents.find((item) => item.type === type);

  return (
    <div className="flex items-center justify-center min-h-[100vh] bg-muted px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-4">
        <h2 className="text-2xl font-semibold text-primary">
          {contentToUse?.text}
        </h2>
        <p className="text-muted-foreground">
          Verify the URL or navigate to the{' '}
          <Link
            to={homeRoutePath || '/home'}
            className="text-primary underline hover:text-primary/80"
          >
            Home Page
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
