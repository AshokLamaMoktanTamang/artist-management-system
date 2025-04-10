import { cn } from '@/utils/cn';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { HookInput } from '@/components/input';
import { HookForm, HookFormProvider } from '@/components/form';
import { ComponentProps, FC, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import PlaceholderImage from '@/assets/images/auth.png';
import { PUBLIC_ROUTES, SELECT_ROLE_OPTIONS } from '@/utils/constants';
import { HookSelect } from '@/components/select';
import { USER_ROLE } from '@/types';
import { useLoginMutation } from '@/store/slices/auth.slice';
import { LoginPayload } from '@/store/types';
import useAuth from '@/hooks/useAuth';

const LoginFormView: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const {
    formState: { isDirty },
  } = useFormContext<LoginPayload>();

  const { loginHandler } = useAuth();
  const [handleLogin, { isLoading }] = useLoginMutation();

  const handleSubmit = useCallback(
    (data: LoginPayload) => handleLogin(data).unwrap().then(loginHandler),
    []
  );

  return (
    <div className={cn('flex flex-col gap-6', className)} {...rest}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <HookForm className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <HookSelect
                name="role"
                required
                label="I am"
                options={SELECT_ROLE_OPTIONS}
                defaultValue={USER_ROLE.SUPER_ADMIN}
              />
              <HookInput
                name="email"
                label="Email"
                placeholder="name@example.com"
                required
                type="email"
              />
              <HookInput
                type="password"
                required
                name="password"
                label="Password"
                placeholder="********"
              />
              <Button
                disabled={!isDirty || isLoading}
                type="submit"
                className="w-full"
              >
                Login
              </Button>

              <Link
                to={PUBLIC_ROUTES.forgotPassword}
                className="m-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>

              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </HookForm>
          <div className="relative hidden bg-muted md:block">
            <img
              src={PlaceholderImage}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{' '}
        <Link to={PUBLIC_ROUTES.terms}>Terms of Service</Link> and{' '}
        <Link to={PUBLIC_ROUTES.policy}>Privacy Policy</Link>.
      </div>
    </div>
  );
};

export const LoginForm: FC<ComponentProps<'div'>> = (props) => {
  return (
    <HookFormProvider>
      <LoginFormView {...props} />
    </HookFormProvider>
  );
};
