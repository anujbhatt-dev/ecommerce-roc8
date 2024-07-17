interface FormItem{
    label:string,
    placeholder:string,
    inputType:string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    value:string
  }

  function FormItem({label,placeholder,inputType, onChange, value}:FormItem){
    return <div className="flex flex-col w-[456px] h-[78px] mb-[32px] capitalize">
          <label className="text-[16px] inter mb-[7px]" htmlFor={label}>{label}</label>
          <input onChange={onChange} className="text-[#848484] h-[48px] border rounded-[6px] pl-2" name={label} type={inputType} placeholder={placeholder} value={value} />
    </div>
  }

  export default FormItem
