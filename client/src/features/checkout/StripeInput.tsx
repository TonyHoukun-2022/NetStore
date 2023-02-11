import { InputBaseComponentProps } from "@mui/material";
import { Ref, forwardRef, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps { }

/**
 * 1、子组件内部先定义一个 xxx 函数
2、通过useImperativeHandle函数，将 xxx函数包装成一个对象，并将该对象添加到父组件内部定义的ref中。
3、若 xxx 函数中使用到了子组件内部定义的变量，则还需要将该变量作为 依赖变量 成为useImperativeHandle第3个参数，上面示例中则选择忽略了第3个参数。
4、若父组件需要调用子组件内的 xxx函数，则通过：res.current.xxx()。
5、请注意，该子组件在导出时必须被 React.forwardRef()包裹住才可以。
 */

//forwardRef => let parent comp <StripeInput> to have access to the return Component, which is the stripe element CardNumberElement
export const StripeInput = forwardRef(function StripeInput({ component: Component, ...props }: Props, ref: Ref<unknown>) {
  //在父組件（stripeinput）中對子組件(CardNumnberElement)的應用
  const elementRef = useRef<any>()

  // 將 focus 函數 添加到 parent 的 ref.current
  //子组件要附加给ref的对象，该对象中的属性即子组件想要暴露给父组件的函数(方法)；
  // 子组件将内部自定义的函数添加到父组件的ref.current上面
  // 父组件若想调用子组件暴露给自己的函数，可以通过 res.current.xxx 来访问或执行
  useImperativeHandle(ref, () => ({
    focus: () => elementRef.current.focus
  }))

  //返回新定義的子組件
  return (
    <Component
      onReady={(element: any) => elementRef.current = element}
      {...props}
    />
  )
})