import Loader from "../components/Loader/Loader";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";
import { FilesProvider } from "../contexts/FilesContext";
import { FileNavigationProvider } from "../contexts/FileNavigationContext";
import { SelectionProvider } from "../contexts/SelectionContext";
import { ClipBoardProvider } from "../contexts/ClipboardContext";
import { LayoutProvider } from "../contexts/LayoutContext";
import { useTriggerAction } from "../hooks/useTriggerAction";
import { useColumnResize } from "../hooks/useColumnResize";
import PropTypes from "prop-types";
import { dateStringValidator, urlValidator } from "../validators/propValidators";
import "./FileManager.scss";

const FileManager = ({
  files,
  fileUploadConfig,
  isLoading,
  onCreateFolder,
  onFileUploading = () => {},
  onFileUploaded = () => {},
  onCut,
  onCopy,
  onPaste,
  onRename,
  onDownload,
  onDelete = () => null,
  onLayoutChange = () => {},
  onRefresh,
  onFileOpen = () => {},
  onSelect,
  onError = () => {},
  layout = "grid",
  enableFilePreview = true,
  maxFileSize,
  filePreviewPath,
  acceptedFileTypes,
  height = "600px",
  width = "100%",
  initialPath = "",
  filePreviewComponent,
  primaryColor = "#6155b4",
  fontFamily = "Nunito Sans, sans-serif",
}) => {
  const triggerAction = useTriggerAction();
  const { containerRef, colSizes, isDragging, handleMouseMove, handleMouseUp, handleMouseDown } =
    useColumnResize(20, 80);
  const customStyles = {
    "--file-manager-font-family": fontFamily,
    "--file-manager-primary-color": primaryColor,
    height,
    width,
  };

  return (
    <main className="file-explorer" onContextMenu={(e) => e.preventDefault()} style={customStyles}>
      <Loader loading={isLoading} />
      <FilesProvider filesData={files} onError={onError}>
        <FileNavigationProvider initialPath={initialPath}>
          <SelectionProvider onDownload={onDownload} onSelect={onSelect}>
            <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
              <LayoutProvider layout={layout}>
                <Toolbar
                  allowCreateFolder
                  allowUploadFile
                  onLayoutChange={onLayoutChange}
                  onRefresh={onRefresh}
                  triggerAction={triggerAction}
                />
                <section
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="files-container"
                >
                  <div className="navigation-pane" style={{ width: colSizes.col1 + "%" }}>
                    <NavigationPane onFileOpen={onFileOpen} />
                    <div
                      className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                      onMouseDown={handleMouseDown}
                    />
                  </div>

                  <div className="folders-preview" style={{ width: colSizes.col2 + "%" }}>
                    <BreadCrumb onFileOpen={onFileOpen}/>
                    <FileList
                      onCreateFolder={onCreateFolder}
                      onRename={onRename}
                      onFileOpen={onFileOpen}
                      onRefresh={onRefresh}
                      enableFilePreview={enableFilePreview}
                      triggerAction={triggerAction}
                    />
                  </div>
                </section>

                <Actions
                  fileUploadConfig={fileUploadConfig}
                  onFileUploading={onFileUploading}
                  onFileUploaded={onFileUploaded}
                  onDelete={onDelete}
                  onRefresh={onRefresh}
                  maxFileSize={maxFileSize}
                  filePreviewPath={filePreviewPath}
                  filePreviewComponent={filePreviewComponent}
                  acceptedFileTypes={acceptedFileTypes}
                  triggerAction={triggerAction}
                />
              </LayoutProvider>
            </ClipBoardProvider>
          </SelectionProvider>
        </FileNavigationProvider>
      </FilesProvider>
    </main>
  );
};

FileManager.displayName = "FileManager";

FileManager.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isDirectory: PropTypes.bool.isRequired,
      path: PropTypes.string.isRequired,
      updatedAt: dateStringValidator,
      size: PropTypes.number,
    })
  ).isRequired,
  fileUploadConfig: PropTypes.shape({
    url: urlValidator,
    headers: PropTypes.objectOf(PropTypes.string),
    method: PropTypes.oneOf(["POST", "PUT"]),
  }),
  isLoading: PropTypes.bool,
  onCreateFolder: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onDownload: PropTypes.func,
  onLayoutChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onFileOpen: PropTypes.func,
  onSelect: PropTypes.func,
  onError: PropTypes.func,
  layout: PropTypes.oneOf(["grid", "list"]),
  maxFileSize: PropTypes.number,
  enableFilePreview: PropTypes.bool,
  filePreviewPath: urlValidator,
  acceptedFileTypes: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialPath: PropTypes.string,
  filePreviewComponent: PropTypes.func,
  primaryColor: PropTypes.string,
  fontFamily: PropTypes.string,
};

export default FileManager;

// const listFile = [
//     {
//         "name": "catalog",
//         "isDirectory": true,
//         "updatedAt": "2025-03-17T08:13:26.000Z",
//         "path": "catalog"
//     },
//     {
//         "name": "category",
//         "isDirectory": true,
//         "updatedAt": "2025-03-17T11:05:25.000Z",
//         "path": "catalog/category"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-17T11:05:25.000Z",
//         "path": "catalog/category/2"
//     },
//     {
//         "name": "0",
//         "isDirectory": true,
//         "updatedAt": "2025-03-17T11:05:25.000Z",
//         "path": "catalog/category/2/0"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T09:39:06.000Z",
//         "path": "catalog/category/a"
//     },
//     {
//         "name": "v",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T09:39:06.000Z",
//         "path": "catalog/category/a/v"
//     },
//     {
//         "name": "Album",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:53.000Z",
//         "path": "catalog/category/Album"
//     },
//     {
//         "name": "Blog",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:53.000Z",
//         "path": "catalog/category/Album/Blog"
//     },
//     {
//         "name": "Picture",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Album/Picture"
//     },
//     {
//         "name": "sale-titan",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Album/Picture/sale-titan"
//     },
//     {
//         "name": "Video",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:53.000Z",
//         "path": "catalog/category/Album/Video"
//     },
//     {
//         "name": "b",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T04:23:16.000Z",
//         "path": "catalog/category/b"
//     },
//     {
//         "name": "r",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T04:29:31.000Z",
//         "path": "catalog/category/b/r"
//     },
//     {
//         "name": "Banner",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner"
//     },
//     {
//         "name": "Home",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner/Home"
//     },
//     {
//         "name": "Background",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner/Home/Background"
//     },
//     {
//         "name": "Hinh_xe",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner/Home/Hinh_xe"
//     },
//     {
//         "name": "Page",
//         "isDirectory": true,
//         "updatedAt": "2025-03-13T10:12:39.000Z",
//         "path": "catalog/category/Banner/Page"
//     },
//     {
//         "name": "Hang_xe",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner/Page/Hang_xe"
//     },
//     {
//         "name": "Khuyen_mai",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Banner/Page/Khuyen_mai"
//     },
//     {
//         "name": "Nhat_ky",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Banner/Page/Nhat_ky"
//     },
//     {
//         "name": "Nhom_phu_tung",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Banner/Page/Nhom_phu_tung"
//     },
//     {
//         "name": "Thuong_hieu",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "catalog/category/Banner/Page/Thuong_hieu"
//     },
//     {
//         "name": "Tra_van_don",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Banner/Page/Tra_van_don"
//     },
//     {
//         "name": "Brand",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Brand"
//     },
//     {
//         "name": "Aftermarket",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Brand/Aftermarket"
//     },
//     {
//         "name": "Economy",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Brand/Economy"
//     },
//     {
//         "name": "Genuine",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Brand/Genuine"
//     },
//     {
//         "name": "OEM",
//         "isDirectory": true,
//         "updatedAt": "2025-03-10T04:42:54.000Z",
//         "path": "catalog/category/Brand/OEM"
//     },
//     {
//         "name": "Car",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:52.000Z",
//         "path": "catalog/category/Car"
//     },
//     {
//         "name": "GM",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM"
//     },
//     {
//         "name": "Aveo",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Aveo"
//     },
//     {
//         "name": "Captiva",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Captiva"
//     },
//     {
//         "name": "Cruze",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Cruze"
//     },
//     {
//         "name": "Gentra",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Gentra"
//     },
//     {
//         "name": "Lacetti",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Lacetti"
//     },
//     {
//         "name": "Spark",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/GM/Spark"
//     },
//     {
//         "name": "Honda",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Honda"
//     },
//     {
//         "name": "City",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Honda/City"
//     },
//     {
//         "name": "Civic",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Honda/Civic"
//     },
//     {
//         "name": "Hyundai",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai"
//     },
//     {
//         "name": "Accent",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Accent"
//     },
//     {
//         "name": "Avante",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Avante"
//     },
//     {
//         "name": "Creta",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Creta"
//     },
//     {
//         "name": "Elantra",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Elantra"
//     },
//     {
//         "name": "Eon",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Eon"
//     },
//     {
//         "name": "Getz",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Getz"
//     },
//     {
//         "name": "Grand_i10",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Grand_i10"
//     },
//     {
//         "name": "i10",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/i10"
//     },
//     {
//         "name": "i20",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/i20"
//     },
//     {
//         "name": "i30",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/i30"
//     },
//     {
//         "name": "Kona",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Kona"
//     },
//     {
//         "name": "Santafe",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Santafe"
//     },
//     {
//         "name": "Solati",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Solati"
//     },
//     {
//         "name": "Sonata",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Sonata"
//     },
//     {
//         "name": "Starex",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Starex"
//     },
//     {
//         "name": "Terracan",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Terracan"
//     },
//     {
//         "name": "Tucson",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Tucson"
//     },
//     {
//         "name": "Veloster",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Veloster"
//     },
//     {
//         "name": "Veracruz",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Hyundai/Veracruz"
//     },
//     {
//         "name": "Kia",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia"
//     },
//     {
//         "name": "Cadenza",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Cadenza"
//     },
//     {
//         "name": "Carens",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Carens"
//     },
//     {
//         "name": "Carnival",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Carnival"
//     },
//     {
//         "name": "Cerato",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Cerato"
//     },
//     {
//         "name": "Forte",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Forte"
//     },
//     {
//         "name": "K3",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/K3"
//     },
//     {
//         "name": "Morning",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Morning"
//     },
//     {
//         "name": "Optima",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Optima"
//     },
//     {
//         "name": "Quoris",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Quoris"
//     },
//     {
//         "name": "Rio",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Rio"
//     },
//     {
//         "name": "Rondo",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Rondo"
//     },
//     {
//         "name": "Sedona",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Sedona"
//     },
//     {
//         "name": "Seltos",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Seltos"
//     },
//     {
//         "name": "Soluto",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Soluto"
//     },
//     {
//         "name": "Sonet",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Sonet"
//     },
//     {
//         "name": "Sorento",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Sorento"
//     },
//     {
//         "name": "Soul",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Soul"
//     },
//     {
//         "name": "Sportage",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Kia/Sportage"
//     },
//     {
//         "name": "Mitsubishi",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi"
//     },
//     {
//         "name": "Attrage",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Attrage"
//     },
//     {
//         "name": "Jolie",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Jolie"
//     },
//     {
//         "name": "Mirage",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Mirage"
//     },
//     {
//         "name": "Pajero",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Pajero"
//     },
//     {
//         "name": "Triton",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Triton"
//     },
//     {
//         "name": "Xpander",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Mitsubishi/Xpander"
//     },
//     {
//         "name": "Toyota",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota"
//     },
//     {
//         "name": "Altis",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Altis"
//     },
//     {
//         "name": "Camry",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Camry"
//     },
//     {
//         "name": "Corolla_Cross",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Corolla_Cross"
//     },
//     {
//         "name": "Fortuner",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Fortuner"
//     },
//     {
//         "name": "Hiace",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Hiace"
//     },
//     {
//         "name": "Highlander",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Highlander"
//     },
//     {
//         "name": "Hilux",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Hilux"
//     },
//     {
//         "name": "Innova",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Innova"
//     },
//     {
//         "name": "Rush",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Rush"
//     },
//     {
//         "name": "Vios",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Vios"
//     },
//     {
//         "name": "Wigo",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Car/Toyota/Wigo"
//     },
//     {
//         "name": "h",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T08:44:05.000Z",
//         "path": "catalog/category/h"
//     },
//     {
//         "name": "e",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T09:48:25.000Z",
//         "path": "catalog/category/h/e"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T08:43:20.000Z",
//         "path": "catalog/category/i"
//     },
//     {
//         "name": "c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T08:49:11.000Z",
//         "path": "catalog/category/i/c"
//     },
//     {
//         "name": "Icon",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon"
//     },
//     {
//         "name": "Big",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon/Big"
//     },
//     {
//         "name": "Medium",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon/Medium"
//     },
//     {
//         "name": "DoiXe",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon/Medium/DoiXe"
//     },
//     {
//         "name": "DongXe",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon/Medium/DongXe"
//     },
//     {
//         "name": "Small",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:51.000Z",
//         "path": "catalog/category/Icon/Small"
//     },
//     {
//         "name": "Product",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:53.000Z",
//         "path": "catalog/category/Product"
//     },
//     {
//         "name": "_",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:32:17.000Z",
//         "path": "catalog/category/_"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:32:17.000Z",
//         "path": "catalog/category/_/p"
//     },
//     {
//         "name": "product",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:53.000Z",
//         "path": "catalog/product/2"
//     },
//     {
//         "name": "0",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/2/0"
//     },
//     {
//         "name": "cache",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:23.000Z",
//         "path": "catalog/product/cache"
//     },
//     {
//         "name": "0ab6540a7ad13b22709646d19d09c893",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:59:23.000Z",
//         "path": "catalog/product/cache/0ab6540a7ad13b22709646d19d09c893"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:59:23.000Z",
//         "path": "catalog/product/cache/0ab6540a7ad13b22709646d19d09c893/2"
//     },
//     {
//         "name": "0cb6d04e357fe46d25ab9b4928f246d5",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:56:46.000Z",
//         "path": "catalog/product/cache/0cb6d04e357fe46d25ab9b4928f246d5"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:56:46.000Z",
//         "path": "catalog/product/cache/0cb6d04e357fe46d25ab9b4928f246d5/2"
//     },
//     {
//         "name": "01546239c8dd0e66ac82065b54f14e94",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:24:12.000Z",
//         "path": "catalog/product/cache/01546239c8dd0e66ac82065b54f14e94"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:24:12.000Z",
//         "path": "catalog/product/cache/01546239c8dd0e66ac82065b54f14e94/2"
//     },
//     {
//         "name": "03bafa687c4e359ea19a489ee465917d",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:02:08.000Z",
//         "path": "catalog/product/cache/03bafa687c4e359ea19a489ee465917d"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:02:08.000Z",
//         "path": "catalog/product/cache/03bafa687c4e359ea19a489ee465917d/2"
//     },
//     {
//         "name": "04500c5a3dbce5462b8004f070e4c03e",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/04500c5a3dbce5462b8004f070e4c03e"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/04500c5a3dbce5462b8004f070e4c03e/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:23.000Z",
//         "path": "catalog/product/cache/04500c5a3dbce5462b8004f070e4c03e/p"
//     },
//     {
//         "name": "04579edfee7cf00e4981de6c1ded3961",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:54:04.000Z",
//         "path": "catalog/product/cache/04579edfee7cf00e4981de6c1ded3961"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:54:04.000Z",
//         "path": "catalog/product/cache/04579edfee7cf00e4981de6c1ded3961/2"
//     },
//     {
//         "name": "0675a7d4861ab17f5cf6037becdc0d2a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/0675a7d4861ab17f5cf6037becdc0d2a"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/0675a7d4861ab17f5cf6037becdc0d2a/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/0675a7d4861ab17f5cf6037becdc0d2a/p"
//     },
//     {
//         "name": "074fe1bacd1510cc5355b41b8604edc5",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:55:14.000Z",
//         "path": "catalog/product/cache/074fe1bacd1510cc5355b41b8604edc5"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:55:14.000Z",
//         "path": "catalog/product/cache/074fe1bacd1510cc5355b41b8604edc5/2"
//     },
//     {
//         "name": "1f9e1e0c7fb311141e2774eadee05928",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:00:11.000Z",
//         "path": "catalog/product/cache/1f9e1e0c7fb311141e2774eadee05928"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:00:11.000Z",
//         "path": "catalog/product/cache/1f9e1e0c7fb311141e2774eadee05928/2"
//     },
//     {
//         "name": "2bb4dbcc1e7a85dbb11e26ac8e1d8fcd",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/2bb4dbcc1e7a85dbb11e26ac8e1d8fcd"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-11T09:45:34.000Z",
//         "path": "catalog/product/cache/2bb4dbcc1e7a85dbb11e26ac8e1d8fcd/2"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/2bb4dbcc1e7a85dbb11e26ac8e1d8fcd/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/2bb4dbcc1e7a85dbb11e26ac8e1d8fcd/p"
//     },
//     {
//         "name": "2daa091eaf86abff4789309719fdfe24",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:58:44.000Z",
//         "path": "catalog/product/cache/2daa091eaf86abff4789309719fdfe24"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:58:44.000Z",
//         "path": "catalog/product/cache/2daa091eaf86abff4789309719fdfe24/2"
//     },
//     {
//         "name": "3e36e7dc078dd250baad38de7e14fb38",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/3e36e7dc078dd250baad38de7e14fb38"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/3e36e7dc078dd250baad38de7e14fb38/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/3e36e7dc078dd250baad38de7e14fb38/p"
//     },
//     {
//         "name": "4a205fb0d2dde81b43c41dced39a1334",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:12:55.000Z",
//         "path": "catalog/product/cache/4a205fb0d2dde81b43c41dced39a1334"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:12:55.000Z",
//         "path": "catalog/product/cache/4a205fb0d2dde81b43c41dced39a1334/2"
//     },
//     {
//         "name": "4f269db0ced6a7adc2eca849b3b82ca3",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/4f269db0ced6a7adc2eca849b3b82ca3"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/4f269db0ced6a7adc2eca849b3b82ca3/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/4f269db0ced6a7adc2eca849b3b82ca3/p"
//     },
//     {
//         "name": "6b9e7b1b3ffcdb4c0958fc46728b5ce3",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/6b9e7b1b3ffcdb4c0958fc46728b5ce3"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/6b9e7b1b3ffcdb4c0958fc46728b5ce3/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/6b9e7b1b3ffcdb4c0958fc46728b5ce3/p"
//     },
//     {
//         "name": "6bf018944ab43d128100ce5a99b756b7",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/6bf018944ab43d128100ce5a99b756b7"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/6bf018944ab43d128100ce5a99b756b7/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/6bf018944ab43d128100ce5a99b756b7/p"
//     },
//     {
//         "name": "7a240e8f95f98bc0c9c64ffa695ebf3e",
//         "isDirectory": true,
//         "updatedAt": "2025-03-11T09:45:34.000Z",
//         "path": "catalog/product/cache/7a240e8f95f98bc0c9c64ffa695ebf3e"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-11T09:45:34.000Z",
//         "path": "catalog/product/cache/7a240e8f95f98bc0c9c64ffa695ebf3e/2"
//     },
//     {
//         "name": "8a386fd24542d04e0def4671c67a259f",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:01:30.000Z",
//         "path": "catalog/product/cache/8a386fd24542d04e0def4671c67a259f"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:01:30.000Z",
//         "path": "catalog/product/cache/8a386fd24542d04e0def4671c67a259f/2"
//     },
//     {
//         "name": "55e863e76154b0359d75e31dfa0aa521",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:14:06.000Z",
//         "path": "catalog/product/cache/55e863e76154b0359d75e31dfa0aa521"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:14:06.000Z",
//         "path": "catalog/product/cache/55e863e76154b0359d75e31dfa0aa521/2"
//     },
//     {
//         "name": "58d7daaa4cb78786cd1ec482e2b411a1",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/cache/58d7daaa4cb78786cd1ec482e2b411a1"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/cache/58d7daaa4cb78786cd1ec482e2b411a1/2"
//     },
//     {
//         "name": "64d56cb2e0f6a233fa04c250dac70d58",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:18:49.000Z",
//         "path": "catalog/product/cache/64d56cb2e0f6a233fa04c250dac70d58"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:18:49.000Z",
//         "path": "catalog/product/cache/64d56cb2e0f6a233fa04c250dac70d58/2"
//     },
//     {
//         "name": "90a661eb16e1c8edd75d90ccc3018129",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:08:00.000Z",
//         "path": "catalog/product/cache/90a661eb16e1c8edd75d90ccc3018129"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:08:00.000Z",
//         "path": "catalog/product/cache/90a661eb16e1c8edd75d90ccc3018129/2"
//     },
//     {
//         "name": "287d874928f4851d45181663f75041db",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:21:42.000Z",
//         "path": "catalog/product/cache/287d874928f4851d45181663f75041db"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:21:42.000Z",
//         "path": "catalog/product/cache/287d874928f4851d45181663f75041db/2"
//     },
//     {
//         "name": "360d27d56bc67e36e1349a43d58a7bc7",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/360d27d56bc67e36e1349a43d58a7bc7"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/360d27d56bc67e36e1349a43d58a7bc7/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/360d27d56bc67e36e1349a43d58a7bc7/p"
//     },
//     {
//         "name": "703b741df9f85930aa9e258e75049b4a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/703b741df9f85930aa9e258e75049b4a"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/703b741df9f85930aa9e258e75049b4a/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:23.000Z",
//         "path": "catalog/product/cache/703b741df9f85930aa9e258e75049b4a/p"
//     },
//     {
//         "name": "2790ba74f25cfea7516931206819afd5",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:20:19.000Z",
//         "path": "catalog/product/cache/2790ba74f25cfea7516931206819afd5"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:20:19.000Z",
//         "path": "catalog/product/cache/2790ba74f25cfea7516931206819afd5/2"
//     },
//     {
//         "name": "5699ab4ca4e182095af2176498b5006a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/5699ab4ca4e182095af2176498b5006a"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/5699ab4ca4e182095af2176498b5006a/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/5699ab4ca4e182095af2176498b5006a/p"
//     },
//     {
//         "name": "6793fda42b044a00736249ea5d56d3b1",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/6793fda42b044a00736249ea5d56d3b1"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/6793fda42b044a00736249ea5d56d3b1/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:23.000Z",
//         "path": "catalog/product/cache/6793fda42b044a00736249ea5d56d3b1/p"
//     },
//     {
//         "name": "8195ea575305c4f2bfbe052c768a5e6f",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/8195ea575305c4f2bfbe052c768a5e6f"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/8195ea575305c4f2bfbe052c768a5e6f/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/8195ea575305c4f2bfbe052c768a5e6f/p"
//     },
//     {
//         "name": "8693dbdd0f7b73906f481bdd23a3b2bc",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:17:20.000Z",
//         "path": "catalog/product/cache/8693dbdd0f7b73906f481bdd23a3b2bc"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:17:20.000Z",
//         "path": "catalog/product/cache/8693dbdd0f7b73906f481bdd23a3b2bc/2"
//     },
//     {
//         "name": "36550b365b09fd1bb14cb638251e253c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/36550b365b09fd1bb14cb638251e253c"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/36550b365b09fd1bb14cb638251e253c/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/36550b365b09fd1bb14cb638251e253c/p"
//     },
//     {
//         "name": "997183e5682e2e9344d397f62afa63ca",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:23:40.000Z",
//         "path": "catalog/product/cache/997183e5682e2e9344d397f62afa63ca"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:23:40.000Z",
//         "path": "catalog/product/cache/997183e5682e2e9344d397f62afa63ca/2"
//     },
//     {
//         "name": "8072798b91c8c265e0d44f483f3c06a4",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/8072798b91c8c265e0d44f483f3c06a4"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/8072798b91c8c265e0d44f483f3c06a4/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/8072798b91c8c265e0d44f483f3c06a4/p"
//     },
//     {
//         "name": "a370fac909ef2e8a9af8560361fc3909",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/a370fac909ef2e8a9af8560361fc3909"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/a370fac909ef2e8a9af8560361fc3909/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/a370fac909ef2e8a9af8560361fc3909/p"
//     },
//     {
//         "name": "ac789cf71ddc03459f52e8f24986a753",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/ac789cf71ddc03459f52e8f24986a753"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/ac789cf71ddc03459f52e8f24986a753/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/ac789cf71ddc03459f52e8f24986a753/p"
//     },
//     {
//         "name": "b4defdbae1f1f21121158caf4635016a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:19:28.000Z",
//         "path": "catalog/product/cache/b4defdbae1f1f21121158caf4635016a"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:19:28.000Z",
//         "path": "catalog/product/cache/b4defdbae1f1f21121158caf4635016a/2"
//     },
//     {
//         "name": "b5b1749f390cbd798387be89d8e7ee62",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b5b1749f390cbd798387be89d8e7ee62"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b5b1749f390cbd798387be89d8e7ee62/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/b5b1749f390cbd798387be89d8e7ee62/p"
//     },
//     {
//         "name": "b11a7c899d99e956edaf73caf09f468b",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b11a7c899d99e956edaf73caf09f468b"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b11a7c899d99e956edaf73caf09f468b/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/b11a7c899d99e956edaf73caf09f468b/p"
//     },
//     {
//         "name": "b312ac7b2160f6db3c42aa37fdc2a010",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b312ac7b2160f6db3c42aa37fdc2a010"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/b312ac7b2160f6db3c42aa37fdc2a010/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/b312ac7b2160f6db3c42aa37fdc2a010/p"
//     },
//     {
//         "name": "bc8ae9829ace8ed24ab7e459e652a19c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:56:07.000Z",
//         "path": "catalog/product/cache/bc8ae9829ace8ed24ab7e459e652a19c"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:56:07.000Z",
//         "path": "catalog/product/cache/bc8ae9829ace8ed24ab7e459e652a19c/2"
//     },
//     {
//         "name": "bdca6ff0c0ee6736921e286305c90241",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/bdca6ff0c0ee6736921e286305c90241"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/bdca6ff0c0ee6736921e286305c90241/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/bdca6ff0c0ee6736921e286305c90241/p"
//     },
//     {
//         "name": "c37ad801b7baef4462bffae31eda0cdb",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:12:13.000Z",
//         "path": "catalog/product/cache/c37ad801b7baef4462bffae31eda0cdb"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:12:13.000Z",
//         "path": "catalog/product/cache/c37ad801b7baef4462bffae31eda0cdb/2"
//     },
//     {
//         "name": "c64b2fa1dbd2271c9b571443290cee4b",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/c64b2fa1dbd2271c9b571443290cee4b"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/c64b2fa1dbd2271c9b571443290cee4b/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/c64b2fa1dbd2271c9b571443290cee4b/p"
//     },
//     {
//         "name": "c197298997f3716cc2328696880febfa",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:58:00.000Z",
//         "path": "catalog/product/cache/c197298997f3716cc2328696880febfa"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:58:00.000Z",
//         "path": "catalog/product/cache/c197298997f3716cc2328696880febfa/2"
//     },
//     {
//         "name": "cb430a207dd913c9b79d49f3925519ea",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/cb430a207dd913c9b79d49f3925519ea"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/cb430a207dd913c9b79d49f3925519ea/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/cb430a207dd913c9b79d49f3925519ea/p"
//     },
//     {
//         "name": "cb9155b9eaac4bb78ba77bbb15230741",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:18:01.000Z",
//         "path": "catalog/product/cache/cb9155b9eaac4bb78ba77bbb15230741"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:18:01.000Z",
//         "path": "catalog/product/cache/cb9155b9eaac4bb78ba77bbb15230741/2"
//     },
//     {
//         "name": "cd39c80e2e4e862cf1015d145be77eb9",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/cd39c80e2e4e862cf1015d145be77eb9"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:01.000Z",
//         "path": "catalog/product/cache/cd39c80e2e4e862cf1015d145be77eb9/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/cd39c80e2e4e862cf1015d145be77eb9/p"
//     },
//     {
//         "name": "e02ec7071b7c085ab2f14d309b613744",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:03:15.000Z",
//         "path": "catalog/product/cache/e02ec7071b7c085ab2f14d309b613744"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:03:15.000Z",
//         "path": "catalog/product/cache/e02ec7071b7c085ab2f14d309b613744/2"
//     },
//     {
//         "name": "e79af7b61f4cc763b57504a6933e14ec",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:24:49.000Z",
//         "path": "catalog/product/cache/e79af7b61f4cc763b57504a6933e14ec"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:24:49.000Z",
//         "path": "catalog/product/cache/e79af7b61f4cc763b57504a6933e14ec/2"
//     },
//     {
//         "name": "fdb9328bec1baa18ebac17c4eab87b22",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/fdb9328bec1baa18ebac17c4eab87b22"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/cache/fdb9328bec1baa18ebac17c4eab87b22/i"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:22.000Z",
//         "path": "catalog/product/cache/fdb9328bec1baa18ebac17c4eab87b22/p"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:00.000Z",
//         "path": "catalog/product/i"
//     },
//     {
//         "name": "c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-14T06:21:34.000Z",
//         "path": "catalog/product/i/c"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T03:10:21.000Z",
//         "path": "catalog/product/p"
//     },
//     {
//         "name": "h",
//         "isDirectory": true,
//         "updatedAt": "2025-03-12T06:44:56.000Z",
//         "path": "catalog/product/p/h"
//     },
//     {
//         "name": "placeholder",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/placeholder"
//     },
//     {
//         "name": "default",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/placeholder/default"
//     },
//     {
//         "name": "watermark",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/watermark"
//     },
//     {
//         "name": "default",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:53:14.000Z",
//         "path": "catalog/product/watermark/default"
//     },
//     {
//         "name": "snowdog",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog"
//     },
//     {
//         "name": "menu",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu"
//     },
//     {
//         "name": "node",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node"
//     },
//     {
//         "name": "2",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/2"
//     },
//     {
//         "name": "0",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/2/0"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/a"
//     },
//     {
//         "name": "s",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/a/s"
//     },
//     {
//         "name": "b",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/b"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/b/a"
//     },
//     {
//         "name": "c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/c"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/c/a"
//     },
//     {
//         "name": "u",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/c/u"
//     },
//     {
//         "name": "e",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/e"
//     },
//     {
//         "name": "l",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/e/l"
//     },
//     {
//         "name": "m",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/e/m"
//     },
//     {
//         "name": "x",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/e/x"
//     },
//     {
//         "name": "f",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/f"
//     },
//     {
//         "name": "r",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/f/r"
//     },
//     {
//         "name": "g",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/g"
//     },
//     {
//         "name": "u",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/g/u"
//     },
//     {
//         "name": "i",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/i"
//     },
//     {
//         "name": "c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/i/c"
//     },
//     {
//         "name": "l",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/l"
//     },
//     {
//         "name": "o",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/l/o"
//     },
//     {
//         "name": "m",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/m"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/m/a"
//     },
//     {
//         "name": "d",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/m/d"
//     },
//     {
//         "name": "o",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/o"
//     },
//     {
//         "name": "t",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/o/t"
//     },
//     {
//         "name": "p",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/p"
//     },
//     {
//         "name": "h",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/p/h"
//     },
//     {
//         "name": "n",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/p/n"
//     },
//     {
//         "name": "r",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/p/r"
//     },
//     {
//         "name": "s",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/s"
//     },
//     {
//         "name": "c",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/s/c"
//     },
//     {
//         "name": "u",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/u"
//     },
//     {
//         "name": "n",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/u/n"
//     },
//     {
//         "name": "z",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/z"
//     },
//     {
//         "name": "a",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T07:25:39.000Z",
//         "path": "snowdog/menu/node/z/a"
//     },
//     {
//         "name": "wysiwyg",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "wysiwyg"
//     },
//     {
//         "name": "album",
//         "isDirectory": true,
//         "updatedAt": "2025-03-05T06:49:50.000Z",
//         "path": "wysiwyg/album"
//     }
// ]