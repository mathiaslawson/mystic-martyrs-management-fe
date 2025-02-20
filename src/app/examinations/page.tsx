"use client"
import React,{useState} from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const page = () => {

    const [date, setDate ] = useState< undefined | Date>(new Date())
    const handleSubmit= ()=>
    {
        console.log('submitted');
    }
  return (
    <div className="mx-auto w-[550px] mt-[100px] space-y-4">
        <h1 className='text-3xl font-semibold'>
            Create Examination
        </h1>
        <p className='text-md text-gray-500'>Please enter the details for the examination</p>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
            <Label htmlFor="title">Examination Title</Label>
                <Input type='text' placeholder='e.g.Discipleship Manual I Exam'/>
            </div>
        <div>
        <Label htmlFor="date">Examination Date</Label>
              <DatePicker date={date} setDate={setDate}  />
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white hover:bg-purple-600/90"
            // disabled={getCellStatus === "executing" || genStat === "executing"}
          >
            {/* {genStat === "executing" && <Loader className="animate-spin text-sm mx-4" />} */}
           Create Examination
          </Button>
        </div>
            </form>
    </div>
  )
}

export default page
