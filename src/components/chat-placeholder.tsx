import { MessageOutlined } from '@ant-design/icons';
import { IGetAppInfoResponse, IGetAppParametersResponse } from '@dify-chat/api';
import { Button, Form, FormItemProps, Input, Select } from 'antd';
import { useMemo } from 'react';
import AppInfo from './app-info';

export interface IConversationEntryFormItem extends FormItemProps {
  type: 'input' | 'select';
}

interface IChatPlaceholderProps {
  /**
   * 表单是否填写
   */
  formFilled: boolean;
  /**
   * 表单填写状态改变回调
   */
  onStartConversation: (formValues: Record<string, unknown>) => void;
  /**
   * 表单数据
   */
  user_input_form?: IGetAppParametersResponse['user_input_form'];
  /**
   * 应用基本信息
   */
  appInfo?: IGetAppInfoResponse;
}

/**
 * 对话区域的占位组件（展示参数填写表单 / 应用信息）
 */
export const ChatPlaceholder = (props: IChatPlaceholderProps) => {
  const { formFilled, onStartConversation, user_input_form, appInfo } = props;

  const [entryForm] = Form.useForm();

  const userInputItems = useMemo(() => {
    return (
      user_input_form?.map((item) => {
        if (item['text-input']) {
          const originalProps = item['text-input'];
          const baseProps: IConversationEntryFormItem = {
            type: 'input',
            label: originalProps.label,
            name: originalProps.variable,
          };
          if (originalProps.required) {
            baseProps.required = true;
            baseProps.rules = [{ required: true, message: '请输入' }];
          }
          return baseProps;
        }
        return {} as IConversationEntryFormItem;
      }) || []
    );
  }, [user_input_form]);

  if (!formFilled && user_input_form?.length) {
    return (
      <div className="w-full h-full flex items-center justify-center -mt-5">
        <div className="w-96">
          <div className="text-2xl text-center font-bold text-default mb-5">
            {appInfo?.name}
          </div>
          <Form form={entryForm}>
            {userInputItems.map((item) => {
              return (
                <Form.Item
                  key={item.name}
                  name={item.name}
                  label={item.label}
                  required={item.required}
                  rules={item.rules}
                >
                  {item.type === 'input' ? (
                    <Input placeholder="请输入" />
                  ) : item.type === 'select' ? (
                    <Select placeholder="请选择" />
                  ) : (
                    '不支持的控件类型'
                  )}
                </Form.Item>
              );
            })}
          </Form>
          <Button
            block
            type="primary"
            icon={<MessageOutlined />}
            onClick={async () => {
              onStartConversation(entryForm.getFieldsValue());
            }}
          >
            开始对话
          </Button>
        </div>
      </div>
    );
  }

  if (appInfo) {
    return (
      <div className="w-full h-full flex items-center justify-center flex-col px-48 box-border">
        <AppInfo info={appInfo} />
        <Button
          className='mt-3'
          type="primary"
          icon={<MessageOutlined />}
          onClick={async () => {
            onStartConversation(entryForm.getFieldsValue());
          }}
        >
          开始对话
        </Button>
      </div>
    );
  }

  return null;
};
