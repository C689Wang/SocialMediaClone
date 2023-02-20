import { authModalState } from '@/atoms/authModalAtom';
import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase/clientApp';
import { FIREBASE_ERRORS } from '@/firebase/errors';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

type SignUpProps = {

};

const SignUp: React.FC<SignUpProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [signupForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState('');

    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);

    // Firebase logic
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error) setError('');
        // passwords don't match
        if (signupForm.password !== signupForm.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // passwords match
        createUserWithEmailAndPassword(signupForm.email, signupForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update the form state
        setSignUpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const createUserDocument = async (user:  User) => {
        await setDoc(doc(firestore, 'users', user.uid), JSON.parse(JSON.stringify(user)));
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred]);

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name="email"
                placeholder="email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                _focus={{
                    boxShadow: 'none',
                    outline: 'none',
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                bg="gray.50"
            />
            <Input
                required
                name="password"
                placeholder="password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                _focus={{
                    boxShadow: 'none',
                    outline: 'none',
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                bg="gray.50"
            />
            <Input
                required
                name="confirmPassword"
                placeholder="confirm password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: "gray.500" }}
                _hover={{
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                _focus={{
                    boxShadow: 'none',
                    outline: 'none',
                    bg: ' white',
                    border: "1 px solid",
                    borderColor: 'blue.500'
                }}
                bg="gray.50"
            />
            {(userError || error) &&
                <Text textAlign='center' color='red' fontSize='10pt'>
                    {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
                </Text>
            }
            <Button width="100%" height="36px" mb={2} mt={2} type='submit' isLoading={loading}>
                Sign Up
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>Already a redditor?</Text>
                <Text
                    color="blue.500"
                    fontWeight={700}
                    textDecoration="underline"
                    cursor="pointer"
                    onClick={() => setAuthModalState((prev) => ({
                        ...prev,
                        view: 'login'
                    }))}
                >
                    Log In
                </Text>
            </Flex>
        </form>

    );
}
export default SignUp;