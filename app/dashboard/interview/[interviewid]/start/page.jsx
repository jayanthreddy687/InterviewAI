"use client"
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { mockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionSection from './_components/QuestionSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function StartInterview({ params }) {  // Note: Component names should be PascalCase
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQues, setMockInterviewQues] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  useEffect(() => {
    getInterviewDetails();
  }, [])

  const getInterviewDetails = async () => {
    const result = await db.select().from(mockInterview)
      .where(eq(mockInterview.mockId, params.interviewid))
    const jsonMockResp = JSON.parse(result[0].jsonMockResp)
    setInterviewData(result[0])
    setMockInterviewQues(jsonMockResp)

  }


  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <QuestionSection mockInterviewQues={mockInterviewQues}
          activeQuestionIndex={activeQuestionIndex} />
        {/* video audio recording */}
        <RecordAnswerSection mockInterviewQues={mockInterviewQues}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData} />
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex > 0 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1 )}> Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQues?.length - 1 &&
          <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
        {activeQuestionIndex == mockInterviewQues?.length - 1 &&
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}><Button >End Interview</Button></Link>
        }
      </div>
    </div>
  )
}

export default StartInterview