import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='h-screen md:h-[calc(100vh-80px)] flex flex-col-reverse md:flex-row gap-20 items-center justify-center duration-200'>
      <div className='bg-white p-10 rounded-xl shadow-xl flex flex-col gap-4'>
        <p className='font-bold'>Login with the following details for testing</p>
        <p><b>Email: </b>testuser@test.com</p>
        <p><b>Username: </b>testuser</p>
        <p><b>Password: </b>testuser_12345</p>
      </div>
      <SignUp />
    </div>
  )
}