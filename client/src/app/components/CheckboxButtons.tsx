import { useState } from 'react'
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'

interface Props {
  items: string[]
  checkedItems?: string[]
  onChange: (items: string[]) => void
}

const CheckboxButtons = ({ items, checkedItems, onChange }: Props) => {
  const [localCheckedItems, setLocalCheckedItems] = useState(checkedItems || [])

  const handleChecked = (value: string) => {
    //current checked index
    const currentIndex = localCheckedItems.findIndex(item => item === value)

    let newCheckedItems: string[] = []
    //add new checked item to list
    if (currentIndex === -1) newCheckedItems = [...localCheckedItems, value]
    //remove the uncheck item
    else newCheckedItems = localCheckedItems.filter(item => item !== value)
    setLocalCheckedItems(newCheckedItems)
    onChange(newCheckedItems)
  }

  return (
    <FormGroup>
      {items.map(item => (
        <FormControlLabel
          control={<Checkbox
            checked={localCheckedItems.indexOf(item) !== -1}
            onClick={() => handleChecked(item)}
          />}
          label={item}
          key={item}
        />
      ))}
    </FormGroup>
  )
}

export default CheckboxButtons