import { cn } from '@/utils/cn';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { HookInput } from '@/components/input';
import { HookForm, HookFormProvider } from '@/components/form';
import { ComponentProps, FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import PlaceholderImage from '@/assets/images/auth.png';
import {
  PUBLIC_ROUTES,
  SELECT_GENDER_OPTIONS,
  SELECT_ROLE_OPTIONS,
} from '@/utils/constants';
import { HookSelect } from '@/components/select';
import { USER_GENDER, USER_ROLE } from '@/types';
import { useSignupMutation } from '@/store/slices/auth.slice';
import { SignupPayload } from '@/store/types';
import { toastSuccess } from '@shared/utils/toast';

const SignupFormView: FC<ComponentProps<'div'>> = ({ className, ...rest }) => {
  const navigate = useNavigate();
  const {
    formState: { isDirty },
  } = useFormContext<SignupPayload>();

  const [signup, { isLoading }] = useSignupMutation();

  const handleSubmit = useCallback((data: SignupPayload) => {
    signup(data)
      .unwrap()
      .then(() => {
        toastSuccess('User Registered', 'User registered sucessfully!');
        navigate(PUBLIC_ROUTES.login);
      });
  }, []);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...rest}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <HookForm className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Sign up to get started
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <HookInput
                  name="first_name"
                  label="First Name"
                  required
                  placeholder="John"
                />
                <HookInput
                  name="last_name"
                  label="Last Name"
                  required
                  placeholder="Doe"
                />
              </div>

              <HookSelect
                name="role"
                required
                label="I am"
                options={SELECT_ROLE_OPTIONS}
                defaultValue={USER_ROLE.ARTIST}
              />

              <HookSelect
                name="gender"
                required
                label="Gender"
                options={SELECT_GENDER_OPTIONS}
                defaultValue={USER_GENDER.MALE}
              />

              <HookInput
                name="dob"
                label="Date of Birth"
                type="date"
                required
                max={
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                    .toISOString()
                    .split('T')[0]
                }
              />

              <HookInput
                name="phone"
                label="Phone"
                placeholder="+977-98XXXXXXXX"
                required
                type="tel"
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
                Sign Up
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link
                  to={PUBLIC_ROUTES.login}
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
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
        By signing up, you agree to our{' '}
        <Link to={PUBLIC_ROUTES.terms}>Terms of Service</Link> and{' '}
        <Link to={PUBLIC_ROUTES.policy}>Privacy Policy</Link>.
      </div>
    </div>
  );
};

export const SignupForm: FC<ComponentProps<'div'>> = (props) => {
  return (
    <HookFormProvider>
      <SignupFormView {...props} />
    </HookFormProvider>
  );
};
