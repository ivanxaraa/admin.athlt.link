import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import FormRow from "@/components/ui/form-row";
import GroupForm from "@/components/ui/group-form";
import { Input } from "@/components/ui/input";
import RowManipulator from "@/components/ui/row-manipulator";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generic } from "@/utils/generic";
import { ImageUp, Plus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputLabel } from "./input-label";

const FormBuilder = ({
  fields,
  data,
  inputChange,
  className,
}: {
  fields: any;
  data: any;
  inputChange: any;
  className?: any;
}) => {
  return (
    <>
      {Object.entries(fields).map(([section, fieldsArray]: any, index) => (
        <GroupForm className={className} key={index} label={section}>
          {fieldsArray.map((field: any, idx: number) => {
            return (
              <FormRow
                key={idx}
                label={field.label}
                labelClass={field.labelClass}
              >
                {field.field_type === "row-manipulator" ? (
                  <RowManipulator
                    id={field.id}
                    label={field.placeholder}
                    data={data[field.id]}
                    onChange={field.onChange || inputChange}
                  >
                    {field.fields.map((innerField: any, innerIdx: any) => {
                      return innerField.field_type === "combobox" ? (
                        <Combobox
                          key={innerField.key}
                          id={innerField.id}
                          onChange={inputChange}
                          data={innerField.data}
                          defaultValue={data[innerField.id]}
                          placeholder={innerField.placeholder}
                          className={cn(innerField.className)}
                        />
                      ) : innerField.prefix ? (
                        <InputLabel
                          key={innerField.key}
                          onChange={(e) =>
                            inputChange(innerField.id, e.target.value)
                          }
                          type={innerField.type}
                          value={data[innerField.id]}
                          placeholder={innerField.placeholder}
                          className={cn(innerField.className)}
                          prefix={innerField.prefix}
                        />
                      ) : (
                        <Input
                          key={innerField.key}
                          placeholder={innerField.placeholder}
                        />
                      );
                    })}
                  </RowManipulator>
                ) : field.field_type === "combobox" ? (
                  <Combobox
                    id={field.id}
                    onChange={inputChange}
                    data={field.data}
                    defaultValue={data[field.id]}
                    className={cn(field.className)}
                  />
                ) : field.field_type === "image" ? (
                  <>
                    <Input
                      id={field.id}
                      className={cn("hidden", field.className)}
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
                        <Plus className="size-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </>
                ) : field.prefix ? (
                  <InputLabel
                    onChange={(e) => inputChange(field.id, e.target.value)}
                    type={field.type}
                    value={data[field.id]}
                    placeholder={field.placeholder}
                    className={cn(field.className)}
                    prefix={field.prefix}
                  />
                ) : (
                  <Input
                    onChange={(e) => inputChange(field.id, e.target.value)}
                    type={field.type}
                    value={data[field.id]}
                    placeholder={field.placeholder}
                    className={cn(field.className)}
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
