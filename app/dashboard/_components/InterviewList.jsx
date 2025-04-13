"use client"
import { db } from '@/utils/db'
import { mockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard'

function interviewList() {
  const { user } = useUser()

  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    user && getInterviewList();
  }, [user])

  const getInterviewList = async () => {
    const result = await db.select()
      .from(mockInterview)
      .where(eq(mockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(mockInterview.id))
      
    setInterviewList(result)
    console.log(result)
  }

  return (
    <div>

      <h2 className='font-medium text-xl'> Previous Mock Interviews </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
        {interviewList && interviewList.map((interview, index)=>(
          <InterviewItemCard interview={interview} key={index}/>
        ))}
      </div>
    </div>
  )
}

export default interviewList