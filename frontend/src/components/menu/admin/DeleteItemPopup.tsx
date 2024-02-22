import {Modal} from "@/components/common/Modal";
import PageSubtitle from "@/components/common/text/PageSubtitle";
import {useContext} from "react";
import {AdminViewMenuPageContext} from "@/pages/admin/waiter/menu/view";

export function DeleteItemPopup() {

    // Getting context for View Menu Item page
    const PageContext = useContext(AdminViewMenuPageContext);

    // Deletes item from database
    function handleDelete() {
        alert("Add request for deleting item");
    }

    return (
        <Modal>
            <div className={"text-center"}>
                <PageSubtitle>Are you sure you want to delete this item?</PageSubtitle>

                {/*Displays the item staged for deletion*/}
                <div className={"border rounded-lg p-1 text-sm"}>
                    {PageContext?.itemToDelete?.name ?
                        <div className={"flex items-center gap-5"}>
                            <div className={"w-16 bg-red-200 self-stretch rounded !bg-contain !bg-no-repeat !bg-center"}
                                 style={{background: `url(${PageContext.itemToDelete.image})`}}
                            />
                            <div className={"flex flex-col text-left py-2"}>
                                <span className={"font-medium"}>{PageContext.itemToDelete.name}</span>
                                <span className={"text-xs"}>Item id: {PageContext.itemToDelete.menuitem_id}</span>
                            </div>
                        </div>
                        :
                        "No item selected"
                    }
                </div>

                <div className={"flex gap-2 text-sm"}>

                    {/*Triggers delete handler method above*/}
                    <button
                        onClick={handleDelete}
                        className={"bg-red-600"}
                    >
                        Yes, delete this item
                    </button>

                    {/*Sets itemToDelete back to undefined, which hides modal*/}
                    <button onClick={() => PageContext?.setItemToDelete(undefined)}>
                        No, close window
                    </button>
                </div>
            </div>
        </Modal>
    )
}