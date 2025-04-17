"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { userAnswerSchema } from '@/utils/schema'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { eq } from 'drizzle-orm'
import { ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function feedback({ params }) {


  const [feedbackList, setFeedbackList] = useState();
  const router = useRouter()
  useEffect(() => {
    getFeedback();
  }, [])

  const getFeedback = async () => {
    const result = await db.select()
      .from(userAnswerSchema)
      .where(eq(userAnswerSchema.mockIdRef, params.interviewid))
      .orderBy(userAnswerSchema.id);

    console.log(result)
    setFeedbackList(result)
  }




  return (
    <div className='p-10'>
      {feedbackList?.length == 0 ?
        <h2 className='font-bold text-xl text-gray-500'> No interview feedback </h2>
        :
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulations</h2>
          <h2 className='font-bold text-2xl'> Here is your interview feedback</h2>
          <h2 className='text-primary text-lg my-3'>your Overall interview rating <strong></strong></h2>

          <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>
          {feedbackList && feedbackList.map((item, index) => (
            <Collapsible key={index} className='mt-7'>
              <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full '>{item.question}
                <ChevronsUpDown className='h-5 w-5'>
                </ChevronsUpDown></CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'> <strong> Rating:</strong>{item.rating}</h2>
                  <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong>{item.userAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong>{item.correctAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback:</strong>{item.feedback}</h2>
                </div>
              </CollapsibleContent>
            </Collapsible>

          ))}
        </>
      }
      <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
    </div>
  )
}

export default feedback