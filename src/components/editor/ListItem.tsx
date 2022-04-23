import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { selectListItem } from "../../store/main";
import type { Item } from "../../store/types";

type Properties = {
  [key: string]: {
    key: string;
    value: string | number;
    type: string;
  }[];
};

const ListItem = ({
  item,
  selected,
  updateItem,
}: {
  item: Item;
  selected: boolean;
  updateItem: (id: number, item: Item) => any;
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Properties>({
    // Register default fields, we dont want to show any map only editable fields
    defaultValues: {
      [`list-item-properties-${item.id}`]: Object.entries(item.properties)
        .filter(([key]) => key !== "radius")
        .map(([key, value]) => ({ key, value, type: typeof value })),
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `list-item-properties-${item.id}`,
  });
  const onSubmit = (data: Properties) =>
    // Remember to add back in the map onl editable fields
    updateItem(item.id, {
      ...item,
      properties: {
        ...data[`list-item-properties-${item.id}`].reduce(
          (prev, curr) => ({ ...prev, [curr.key]: curr.value }),
          {}
        ),
        radius: item.properties.radius,
      },
    });

  const [coodsOpen, setCoordsOpen] = useState(false);

  return (
    <div
      className={`card bg-base-300 shadow-xl ${
        selected && "border-2 border-accent col-span-3"
      }`}
      onClick={() => selectListItem(item.id)}
    >
      <div
        tabIndex={0}
        className={`collapse collapse-arrow ${
          selected ? "collapse-open" : "collapse-close"
        }`}
      >
        <div className="collapse-title text-sm font-medium flex justify-between">
          <div>{item.properties.name || item.geometry.type}</div>
          <div>{item.properties.id || item.id}</div>
        </div>
        <div className="collapse-content">
          <div className="card-body px-4 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              {fields.length === 0 ? (
                <div className="text-center">
                  <p>~Looks like you have no properties~</p>
                </div>
              ) : (
                fields.map(({ key, type, id }, index) => (
                  <div className="flex flex-row justify-between my-2" key={id}>
                    <div className="flex-1 mx-1">
                      <input
                        type="text"
                        placeholder="key"
                        className={`input input-bordered w-full ${
                          errors?.[`list-item-properties-${item.id}`]?.[index]
                            ?.key
                            ? "input-error"
                            : ""
                        }
                    `}
                        {...register(
                          `list-item-properties-${item.id}.${index}.key` as const,
                          {
                            required: true,
                          }
                        )}
                      ></input>
                    </div>
                    <div className="flex-1 mx-1">
                      <input
                        type={type === "number" ? "number" : "text"}
                        placeholder="value"
                        className={`input input-bordered w-full ${
                          errors?.[`list-item-properties-${item.id}`]?.[index]
                            ?.value
                            ? "input-error"
                            : ""
                        }
                    `}
                        {...register(
                          `list-item-properties-${item.id}.${index}.value` as const,
                          {
                            required: true,
                          }
                        )}
                      />
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <button
                      className="btn btn-square btn-error"
                      disabled={key === "radius"}
                      onClick={() => remove(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
              <div className="divider my-6">
                <div className="dropdown">
                  <label tabIndex={3} className="btn btn-sm btn-accent">
                    Add
                  </label>
                  <ul
                    tabIndex={3}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a
                        onClick={() =>
                          append({ key: "", value: "", type: "string" })
                        }
                      >
                        String
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() =>
                          append({ key: "", value: "", type: "number" })
                        }
                      >
                        Number
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                tabIndex={1}
                onClick={() => setCoordsOpen(!coodsOpen)}
                className={`collapse bg-base-100 mb-4 rounded-lg ${
                  coodsOpen ? "collapse-open" : "collapse-close"
                }`}
              >
                <div className="collapse-title text-md font-medium">
                  Coordinates
                </div>
                {coodsOpen && (
                  <div className="collapse-content">
                    <pre className="whitespace-pre-wrap bg-neutral rounded-lg p-2 text-white text-sm select-all overflow-y-scroll max-h-20">
                      <code>{JSON.stringify(item.geometry.coordinates)}</code>
                    </pre>
                  </div>
                )}
              </div>
              <div className="card-actions justify-end">
                <input type="submit" className="btn btn-accent btn-sm" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
