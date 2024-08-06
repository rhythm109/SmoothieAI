import './SigninPage.css'
import { SignIn } from '@clerk/clerk-react'

const SigninPage = () => {
    return (
        <div className="SigninPage">
            <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl= "/" />
        </div>
    )
}

export default SigninPage