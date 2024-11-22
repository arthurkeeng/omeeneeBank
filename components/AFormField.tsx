import { FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authFormSchema } from "@/lib/utils"
import {Control, FieldPath} from 'react-hook-form'
import { z } from "zod"


const  formSchema = authFormSchema("sign-up")
interface CustomInput{
  control : Control<z.infer<typeof formSchema>>, 
  name : FieldPath<z.infer<typeof formSchema>>, 
  label : string , 
  placeholder : string
}

const AFormField = ({control , name , placeholder , label} : CustomInput) => {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <div className="form-item">
          <FormLabel className="form-label">
              {label}
          </FormLabel>
          <div className="flex w-full flex-col">
              <FormControl>
                  <Input
                  placeholder={placeholder}
                  className="input-class mb-3" {...field}
                  />
              </FormControl>
              <FormMessage className="form-message"/>
          </div>
      </div>
    )}
  />
  )
}

export default AFormField
