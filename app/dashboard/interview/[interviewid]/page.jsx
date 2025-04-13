"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { mockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

function interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log(params.interviewid)
    getInterviewDetails();
  }, [])

  // Used to get Interview details by Mock interview ID
  const getInterviewDetails = async () => {
      const result = await db.select().from(mockInterview)
        .where(eq(mockInterview.mockId, params.interviewid))
      console.log(result[0])
      setInterviewData(result[0])
  }

  return (

    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

        <div className='flex flex-col my-5 gap-5 justify-center'>
          <div className='flex flex-col p-5 rounded-lg border'>
          <h2 className='text-lg'> <strong>Job Position: </strong>{interviewData ?interviewData.jobPosition : 'Loading'}</h2>
          <h2 className='text-lg'> <strong>Job Description / Tech Stack: </strong>{interviewData ?interviewData.jobDesc:'Loading'}</h2>
          <h2 className='text-lg'> <strong>Years of Experience: </strong>{interviewData ?interviewData.jobExperience:'Loading'}</h2>
          </div>
          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'> <Lightbulb/><strong>Information</strong> </h2>
            <h2 className='mt-3 text-yellow-500'>add Information here</h2>
          </div>
        </div>
        <div>
          {webCamEnabled ? <Webcam
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
            mirror={true}
            style={{
              height: 300,
              width: 300
            }}
          /> :
            <>
              <WebcamIcon className='h-72 w-72 my-7 p-20 bg-secondary rounded-lg border' />
              <Button onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
            </>
          }
        </div>
      </div>
      <div className='flex justify-end items-end'>  
        <Link href={'/dashboard/interview/'+ params.interviewid+'/start'}>
        <Button>Start Interview</Button> 
        </Link> 
      </div>

    </div>
  )
}

export default interview