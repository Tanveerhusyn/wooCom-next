import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { IoContract, IoInformationCircleOutline } from "react-icons/io5"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"

const ImageBox = ({ imgBoxElm: img, setImgBoxElm }) => {
  const handleClose = () => setImgBoxElm(null)
  return (
    <>
      <Transition show={!!img} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                // image goes null before the modal closes causing height shift
                // either use useState to toggle and persist the image forever
                // or duration-0
                leave="ease-in duration-0"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex max-h-[75dvh] w-full max-w-lg transform flex-col rounded-md bg-white p-4 shadow-xl transition-all">
                  {/* react zoom pan pinch components */}
                  <TransformWrapper
                    minScale={0.5}
                    centerOnInit={true}
                    // limitToBounds={false}
                  >
                    <TransformComponent wrapperClass="w-full">
                      <img src={img?.src} alt="" />
                    </TransformComponent>
                  </TransformWrapper>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <small className="text-gray-700 xl:text-xs">
                      <IoInformationCircleOutline className="me-0.5 inline bg-white align-text-bottom text-base " />
                      Use scrollwheel or pinch to zoom
                    </small>
                    <button
                      className="ms-auto grid place-items-center rounded-full border-2 bg-white text-2xl opacity-60 hover:opacity-100"
                      title="Close Imagebox"
                      onClick={handleClose}
                    >
                      <IoContract className="p-0.5" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ImageBox
