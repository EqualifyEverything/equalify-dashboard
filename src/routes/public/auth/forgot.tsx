import { AuthLayout } from '~/components/layout';
import SEO from '~/components/layout/seo';
import { Public } from '../..';
import { useStore } from '~/store';
import * as Auth from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
    const navigate = useNavigate();
    const setLoading = useStore(state => state.setLoading);
    const forgotPassword = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { email } = Object.fromEntries(new FormData(e.currentTarget));
            if (!email) {
                throw Error;
            }
            await Auth.resetPassword({ username: email.toString() });
            alert(`Success! Please check your email address for a link to reset your password`);
            navigate('/login');
            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            console.log(err);
            alert('You must enter an email address');
        }
    }
    return <Public>
        <AuthLayout>
            <SEO
                title="Forgot Password - Equalify"
                description="Log in to your Equalify account to manage your properties and reports."
                url="https://www.equalify.dev/forgot"
            />
            <section className="flex h-full w-full flex-col items-center justify-center gap-10">
                <div className="w-full max-w-md space-y-2">
                    <h1 className="text-3xl md:text-[2.5rem]">Forgot Password</h1>
                    <h2 className="text-base text-[#4D4D4D]">
                        Please enter your email address to reset your password{' '}
                        <span role="img" aria-hidden="true">
                            📧
                        </span>
                    </h2>
                </div>
                <form onSubmit={forgotPassword} className='flex flex-col gap-8 w-full max-w-[448px]'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='email' className='text-sm'>Email address</label>
                        <input id='email' name='email' className='rounded-md p-3' />
                    </div>
                    <button className='bg-[#1D781D] text-white rounded-md p-3 text-sm' type='submit'>Reset password</button>
                </form>
            </section>
        </AuthLayout>
    </Public>
};

export default Forgot;
