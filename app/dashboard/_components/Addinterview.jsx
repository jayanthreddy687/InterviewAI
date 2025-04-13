"use client"
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { chatSession } from '@/utils/geminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { mockInterview } from '@/utils/schema'
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
function Addinterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPositon] = useState()
  const [jobExperience, setjobExperience] = useState()
  const [jobDescription, setjobDescription] = useState()
  const [loading, setLoading] = useState(false)
  const [jsonResp, setJSONResp] = useState([])
  const router = useRouter(); 
  const { user } = useUser();
  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    console.log(jobPosition, jobDescription, jobExperience)
    const inputPrompt = "jobPosition" + jobPosition + "jobDescription" + jobDescription + "jobExperience" + jobExperience + "Depending on give data please give me 5 interview questions and answers in JSON format"
    const result = await chatSession.sendMessage(inputPrompt);

    const MockJSONResp = (result.response.text()).replace('```json', '').replace('```', '')
    // console.log(JSON.parse(MockJSONResp));

    setJSONResp(MockJSONResp)
    if (MockJSONResp) {
      const resp = await db.insert(mockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJSONResp,
          jobPosition: jobPosition,
          jobDesc: jobDescription,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({ mockID: mockInterview.mockId })
      console.log("Inserted ID:", resp)
      if(resp){
        setOpenDialog(false)
        router.push('/dashboard/interview/'+resp[0]?.mockID)
      }
    }

    setLoading(false)
  }
  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer translation:all'
        onClick={() => setOpenDialog(true)}>
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='font-bold text-2xl'>Tell us more about the job you are Interviewing</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details about job position. Your skills and years of experience</h2>
                  <div className="mt-7 my-3">
                    <label>Job Role / Job Description</label>
                    <Input placeholder="Full stack Developer" required onChange={(event) => setJobPositon(event.target.value)} />
                  </div>
                  <div className="my-3">
                    <label>Job Description / Tech Stack (in Short)</label>
                    <Textarea placeholder="Ex- React, Angular, Nodejs, SQL .etc" required onChange={(event) => setjobDescription(event.target.value)} />
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input type='number' placeholder="Ex- 5" required onChange={(event) => setjobExperience(event.target.value)} />
                  </div>
                </div>
                <div className='flex gap-5 justify-end '>
                  <Button type='submit' disabled={loading}> {loading ? <> <LoaderCircle className='animate-spin' />Generating from AI</> : 'Start Interview'} </Button>
                  <Button type='button' variant='ghost' onClick={() => setOpenDialog(false)} >Cancel</Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Addinterview