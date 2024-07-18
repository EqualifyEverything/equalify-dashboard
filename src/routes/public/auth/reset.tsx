import { AuthLayout } from '~/components/layout';
import SEO from '~/components/layout/seo';
import { Public } from '../..';
import { useStore } from '~/store';
import * as Auth from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Reset = () => {
    const navigate = useNavigate();
    const setLoading = useStore(state => state.setLoading);
    const resetPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const urlParams = new URLSearchParams(location.search);
            const username = urlParams.get('username');
            const code = urlParams.get('code');
            const { password, confirm } = Object.fromEntries(new FormData(e.currentTarget));

            if (!username || !code) {
                throw Error('This reset password link is no longer valid');
            }
            if (!password || !confirm) {
                throw Error('You must fill out both fields');
            }
            else if (password !== confirm) {
                throw Error('Make sure your passwords match');
            }
            else if (password.length < 6) {
                throw Error('Your password must be at least 6 characters long');
            }

            await Auth.confirmResetPassword({ username, confirmationCode: code, newPassword: password.toString() });
            setLoading(false);
            alert('Success! Logging in...');
            await Auth.signIn({ username, password });
            navigate('/reports');
        }
        catch (err) {
            setLoading(false);
            alert(err.message);
        }
    }
    return <Public>
        <AuthLayout>
            <SEO
                title="Reset Password - Equalify"
                description="Log in to your Equalify account to manage your properties and reports."
                url="https://www.equalify.dev/reset"
            />
            <section className="flex h-full w-full flex-col items-center justify-center gap-10">
                <div className="w-full max-w-md space-y-2">
                    <h1 className="text-3xl md:text-[2.5rem]">Reset Password</h1>
                    <h2 className="text-base text-[#4D4D4D]">
                        Please enter your new password{' '}
                        <span role="img" aria-hidden="true">
                            🔒
                        </span>
                    </h2>
                </div>
                <form onSubmit={resetPassword} className='flex flex-col gap-8 w-full max-w-[448px]'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm'>Password</label>
                        <input name='password' className='rounded-md p-3' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm'>Confirm password</label>
                        <input name='confirm' className='rounded-md p-3' />
                    </div>
                    <button className='bg-[#1D781D] text-white rounded-md p-3 text-sm' type='submit'>Reset password</button>
                </form>
            </section>
        </AuthLayout>
    </Public>
};

export default Reset;
