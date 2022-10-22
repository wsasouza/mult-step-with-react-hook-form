import { FormProvider, useForm } from 'react-hook-form'
import { Steps } from './Stepper'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { PersonalInfo } from './StepComponents/PersonalInfo'
import { Address } from './StepComponents/Address'
import { Contact } from './StepComponents/Contact'
import { useState } from 'react'

type FormData = {
  name: string
  lastName: string
  age: string
  street: string
  streetNumber: string
  city: string
  mobileNumber: string
  telNumber: string
}

const schema = z
  .object({
    name: z
      .string()
      .min(2, 'O mínimo de caracteres é 2, por favor corrigir')
      .max(50, 'O máximo de caracteres é 50, por favor corrigir'),
    lastName: z
      .string()
      .min(2, 'O mínimo de caracteres é 2, por favor corrigir')
      .max(50, 'O máximo de caracteres é 50, por favor corrigir'),

    age: z.string().min(1, 'O mínimo de caracteres é 1, por favor corrigir'),

    street: z.string().min(1, 'O mínimo de caracteres é 1, por favor corrigir'),
    streetNumber: z
      .string()
      .min(1, 'O mínimo de caracteres é 1, por favor corrigir'),
    city: z.string().min(1, 'O mínimo de caracteres é 1, por favor corrigir'),

    mobileNumber: z
      .string()
      .min(1, 'O mínimo de caracteres é 1, por favor corrigir'),
    telNumber: z
      .string()
      .min(1, 'O mínimo de caracteres é 1, por favor corrigir'),
  })
  .required()

type FormValues = z.infer<typeof schema>

const sourceSteps = [
  {
    label: 'Dados Pessoais',
    Component: <PersonalInfo />,
    fields: ['name', 'lastName', 'age'],
    hasError: false,
  },
  {
    label: 'Dados de Endereço',
    fields: ['street', 'streetNumber', 'city'],
    Component: <Address />,
    hasError: false,
  },
  {
    label: 'Dados de Contato',
    fields: ['mobileNumber', 'telNumber'],
    Component: <Contact />,
    hasError: false,
  },
]

const getSteps = (errors: string[]) => {
  return sourceSteps.map((step) => {
    return {
      ...step,
      hasError: errors.some((error) => step.fields.includes(error)),
    }
  })
}

const initialValue = {
  name: '',
  lastName: '',
  age: '',
  street: '',
  streetNumber: '',
  city: '',
  mobileNumber: '',
  telNumber: '',
}

export function Form() {
  const [data, setData] = useState<FormData>(initialValue)

  const methods = useForm({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
    mode: 'all',
    defaultValues: initialValue,
  })

  const handleFormData = (data: FormValues) => {
    setData(data)
  }

  const fullName = `Meu nome é ${data.name} ${data.lastName} e tenho ${data.age} anos.`
  const address = `Moro na rua ${data.street}, ${data.streetNumber} - ${data.city}.`
  const phones = `Meu telefone residencial é ${data.telNumber} e meu celular é ${data.mobileNumber}.`

  if (methods.formState.isSubmitSuccessful) {
    return (
      <Box>
        <Typography variant="h2">Formulário enviado com sucesso!</Typography>
        <Button onClick={() => methods.reset()}>
          Clique aqui para enviar um novo cadastro
        </Button>
        <Typography variant="h6">{fullName} </Typography>
        <Typography variant="h6">{address}</Typography>
        <Typography variant="h6">{phones}</Typography>
      </Box>
    )
  }

  const steps = getSteps(Object.keys(methods.formState.errors))

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => handleFormData(data))}>
        <Steps items={steps} />
      </form>
    </FormProvider>
  )
}
