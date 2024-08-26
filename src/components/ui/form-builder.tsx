import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import FormRow from "@/components/ui/form-row";
import GroupForm from "@/components/ui/group-form";
import { Input } from "@/components/ui/input";
import RowManipulator from "@/components/ui/row-manipulator";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generic } from "@/utils/generic";
import { ImageUp, Upload } from "lucide-react";

const FormBuilder = ({
  fields,
  data,
  inputChange,
}: {
  fields: any;
  data: any;
  inputChange: any;
}) => {
  return (
    <>
      {Object.entries(fields).map(([section, fieldsArray]: any, index) => (
        <GroupForm key={index} label={section}>
          {fieldsArray.map((field: any, idx: number) => {
            return (
              <FormRow
                key={idx}
                label={field.label}
                labelClass={field.labelClass}
                className={field.className}
              >
                {field.field_type === "row-manipulator" ? (
                  <RowManipulator
                    id={field.id}
                    label={field.placeholder}
                    data={data[field.id]}
                    onChange={field.onChange || inputChange}
                  >
                    {field.fields.map((innerField: any, innerIdx: any) => (
                      <Input
                        key={innerField.key}
                        placeholder={innerField.placeholder}
                      />
                    ))}
                  </RowManipulator>
                ) : field.field_type === "combobox" ? (
                  <Combobox
                    id={field.id}
                    onChange={inputChange}
                    data={field.data}
                    defaultValue={data[field.id]}
                  />
                ) : field.field_type === "image" ? (
                  <>
                    <Input
                      id={field.id}
                      className="hidden"
                      type="file"
                      onChange={(e) =>
                        e.target.files &&
                        inputChange(field.id, e.target.files[0])
                      }
                    />
                    <Avatar
                      onClick={() => document.getElementById(field.id)?.click()}
                      className="size-24 cursor-pointer"
                    >
                      <AvatarImage
                        src={
                          generic.misc.isFile(data[field.id])
                            ? URL.createObjectURL(data[field.id])
                            : data[field.id]
                        }
                      />
                      <AvatarFallback>
                        <Upload className="size-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <Input
                    onChange={(e) => inputChange(field.id, e.target.value)}
                    type={field.type}
                    value={data[field.id]}
                    placeholder={field.placeholder}
                  />
                )}
              </FormRow>
            );
          })}
        </GroupForm>
      ))}
    </>
  );
};

export default FormBuilder;
