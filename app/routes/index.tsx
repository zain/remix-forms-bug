import { z } from "zod";
import { Form } from "~/Form";
import { Combobox } from "@headlessui/react";
import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ActionFunction } from "@remix-run/node";
import { formAction } from "~/form-action.server";
import { makeDomainFunction } from "domain-functions";

const schema = z.object({
  assignees: z.string().array(),
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

export const action: ActionFunction = async ({ request }) => {
  return formAction({
    request,
    schema,
    mutation: makeDomainFunction(schema)(async (values) => {
      const formData = await request.formData();
      console.log(formData.get("conditions"));
      console.log(values);
      return values;
    }),
    successPath: "/",
  });
};

export default function Index() {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]]);
  return (
    <Form
      schema={schema}
      values={{
        assignees: [],
      }}
    >
      {({ Field, Errors, Button }) => (
        <>
          <Field name="assignees">
            {({ Label, SmartInput, Errors }) => (
              <>
                <Errors />

                <Combobox
                  as="div"
                  value={selectedPeople}
                  onChange={setSelectedPeople}
                  name="assignees"
                  multiple
                >
                  <Combobox.Label className="block text-sm font-medium text-gray-700">
                    Assigned to
                  </Combobox.Label>
                  <div className="relative mt-1">
                    <Combobox.Input
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      displayValue={(people) =>
                        people.map((person) => person.name).join(", ")
                      }
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {people.map((person) => (
                        <Combobox.Option
                          key={person.id}
                          value={person}
                          className={({ active }) =>
                            classNames(
                              "relative cursor-default select-none py-2 pl-3 pr-9",
                              active
                                ? "bg-indigo-600 text-white"
                                : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span
                                className={classNames(
                                  "block truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {person.name}
                              </span>

                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                    active ? "text-white" : "text-indigo-600"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </>
            )}
          </Field>
          <Errors />
          <Button />
        </>
      )}
    </Form>
  );
}
