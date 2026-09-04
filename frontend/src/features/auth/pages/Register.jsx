import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";


function Register() {

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Join Blogify and start writing.
                    </p>
                </div>
                <RegisterForm />

                  <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-gray-900 underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>

        </main>
    );
}


export default Register;