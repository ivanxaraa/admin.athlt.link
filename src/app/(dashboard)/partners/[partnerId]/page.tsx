"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GroupForm from "@/components/ui/group-form";
import FormRow from "@/components/ui/form-row";
import Heading1 from "@/components/ui/heading-1";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { generic } from "@/utils/generic";

function Page({ params }: { params: { partnerId: string } }) {
  const router = useRouter();
  const { partnerId } = params;
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
      {
        id: "url",
        label: "Partner URL",
        placeholder: "Partner URL",
        className: "col-span-2",
      },
    ],
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from("partners")
          .select("*")
          .eq("id", partnerId)
          .single();

        if (error) throw error;

        setPartner(data);
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Failed to fetch partner data.");
      }
    };
    fetch();
  }, [partnerId]);

  const handleSave = async () => {
    setLoading(true); // Start loading
    try {
      if (generic.misc.isFile(partner.image)) {
        const { error: imageError } = await supabase.storage
          .from("partners")
          .upload(String(partner.id), partner.image, {
            cacheControl: "no-cache",
            upsert: true,
          });

        if (imageError) throw imageError;
      }

      const { error } = await supabase
        .from("partners")
        .update({
          ...partner,
          image: `https://vkgipqsozevltuwoxkfe.supabase.co/storage/v1/object/public/partners/${partner.id}`,
        })
        .eq("id", partner.id);

      if (error) throw error;
      toast.success(`Partner updated successfully!`);
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong while saving.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleDelete = async () => {
    setLoading(true); // Start loading
    try {
      const { error: deleteError } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId);

      if (deleteError) throw deleteError;

      const { error: storageError } = await supabase.storage
        .from("partners")
        .remove([`${partnerId}`]);

      if (storageError) throw storageError;

      toast.success("Partner deleted successfully!");
      router.push("/partners");
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Something went wrong while deleting.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Heading1 back="/partners">{partner.name || "Loading..."}</Heading1>

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
                      <AvatarFallback />
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

        {/* Action Buttons */}
        <GroupForm>
          <div className="flex justify-end items-center w-full col-span-2 gap-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </GroupForm>
      </div>
    </>
  );
}

export default Page;
