"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { NodeProps } from '@xyflow/react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const BaseForm = (props:NodeProps&{children:React.ReactNode,trigger:React.ReactNode, desc?:string,onSave?:()=>void|Promise<void>}) => {
    const {id} = useParams<{id:string}>()
    const [open ,setOpen] = useState(false)
 if(id)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger >{props.trigger}</DialogTrigger>
     
        <DialogContent>
               <DialogHeader>
            <DialogTitle>
               {props.type.split("_").join(" ")} data
            </DialogTitle>
            <DialogDescription>
                   {props.desc}
            </DialogDescription>
        </DialogHeader>
        {props.children}
          {props.onSave &&
        <DialogFooter>
            <DialogClose>
                Cancel
            </DialogClose>
            <Button onClick={async()=>{
                if(props.onSave) {
                    await props.onSave()
                }
                setOpen(false)
            }}>Save</Button>
        </DialogFooter>
        
        }
        </DialogContent>
      
    </Dialog>
  )
}

export default BaseForm