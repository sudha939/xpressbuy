import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import { useEffect, useState } from 'react';
import { db } from '../config/db';
import Spinner from '../components/common/Spinner';
import AuthContainer from '../components/AuthContainer';

const SignupPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputs = [
    {
      id: 1,
      type: 'text',
      name: 'firstname',
      label: 'First Name',
      required: true,
      errorMessage: 'First Name is mandatory',
    },
    {
      id: 2,
      type: 'text',
      name: 'lastname',
      label: 'Last Name',
      required: true,
      errorMessage: 'Last Name is mandatory',
    },
    {
      id: 3,
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true,
      errorMessage: 'Email is not valid',
    },
    {
      id: 4,
      type: 'password',
      name: 'password',
      label: 'Password',
      required: true,
      pattern:
        '^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&]{6,18}$',
      errorMessage:
        'Password should contain at least 1 capital letter, 1 small letter, 1 number, 1 special character and the length should be between 6 to 18 characters',
    },
    {
      id: 5,
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
      required: true,
      pattern: values.password,
      errorMessage: 'Passwords do not match',
    },
  ];

  const inputChangeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const formSubmitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const result = await db.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          firstname: values.firstname,
          lastname: values.lastname,
        },
      },
    });
    if (result) {
      setLoading(false);
    }
    if (result.error && result.error.status === 400) {
      setFormError(result.error.message);
      return;
    }
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => {
      setFormError(null);
    }, 10000);
  }, [formError]);

  if (loading) return <Spinner />;
  return (
    <AuthContainer
      title='Signup'
      formSubmitHandler={formSubmitHandler}
      error={formError}
      redirectMessage='Already have an account?'
      href='login'
    >
      {inputs.map((input) => (
        <Input
          key={input.id}
          type={input.type}
          name={input.name}
          id={input.name}
          label={input.label}
          value={values[input.name]}
          required={input.required}
          pattern={input.pattern}
          onChange={inputChangeHandler}
          errorMessage={input.errorMessage}
        />
      ))}
    </AuthContainer>
  );
};

export default SignupPage;
