import { FC } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import ErrorState, { ErrorStateType } from '../ErrorState';

const ErrorBoundary: FC<{ homeRoutePath?: string }> = ({ homeRoutePath }) => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-muted text-center">
          <p className="text-xl font-medium text-destructive">
            You aren't authorized to see this.
          </p>
        </div>
      );
    }

    if (error.status === 404) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-muted"
          style={{ minHeight: '100vh' }}
        >
          <ErrorState
            type={ErrorStateType.PAGENOTEXIST}
            homeRoutePath={homeRoutePath}
          />
        </div>
      );
    }
  }

  if (error) console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <ErrorState type={ErrorStateType.SERVERERROR} />
    </div>
  );
};

export default ErrorBoundary;
