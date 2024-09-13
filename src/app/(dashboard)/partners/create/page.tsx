"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GroupForm from "@/components/ui/group-form";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { generic } from "@/utils/generic";

function Page({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [partner, setPartner] = useState<any>({});
  const [loading, setLoading] = useState(false); // Loading state

  const inputChange = (key: string, value: any) => {
    if (key === "username") value = value.replace(/[^\w]/g, "");
    setPartner((prev: any) => ({ ...prev, [key]: value }));
  };

  const [fields, setFields] = useState<any>({
    Details: [
      {
        id: "image",
        field_type: "image",
        className: "col-span-2",
      },
      {
        id: "name",
        label: "Partner Name",
        placeholder: "Partner name",
        className: "col-span-2",
      },
      {
        id: "description",
        label: "Descrição",
        field_type: "textarea",
        className: "col-span-2",
      },
    ],
  });

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    try {
      const { data: partnerData, error: insertError } = await supabase
        .from("partners")
        .insert(partner)
        .select()
        .single();

      if (insertError) throw insertError;

      if (partner.image) {
        const { error: uploadError } = await supabase.storage
          .from("partners")
          .upload(String(partnerData.id), partner.image, {
            cacheControl: "0",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { error: updatePartner } = await supabase
          .from("partners")
          .update({
            image: `https://vkgipqsozevltuwoxkfe.supabase.co/storage/v1/object/public/partners/${partnerData.id}`,
          })
          .eq("id", partnerData.id);

        if (updatePartner) throw updatePartner;
      }

      toast.success("Partner created!");
      router.push("/partners");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Heading1 back="/partners">Create Partner</Heading1>

      <div className="mt-4 rounded-lg flex flex-col gap-16">
        {Object.entries(fields).map(([section, fieldsArray]: any, index) => (
          <GroupForm key={index} label={section}>
            {fieldsArray.map((field: any, idx: number) => (
              <FormRow
                key={idx}
                label={field.label}
                className={field.className}
              >
                {field.field_type === "combobox" ? (
                  <Combobox
                    id={field.id}
                    onChange={inputChange}
                    defaultValue={partner[field.id]}
                    data={field.data}
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
                          generic.misc.isFile(partner[field.id])
                            ? URL.createObjectURL(partner[field.id])
                            : partner[field.id]
                        }
                      />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                  </>
                ) : field.field_type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    value={partner[field.id]}
                    onChange={(e) => inputChange(field.id, e.target.value)}
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={partner[field.id]}
                    placeholder={field.placeholder}
                    onChange={(e) => inputChange(field.id, e.target.value)}
                  />
                )}
              </FormRow>
            ))}
          </GroupForm>
        ))}

        {/* buttons */}
        <GroupForm>
          <div className="flex justify-end items-center w-full col-span-2 gap-4">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating Partner..." : "Create Partner"}
            </Button>
          </div>
        </GroupForm>
      </div>
    </>
  );
}

export default Page;
