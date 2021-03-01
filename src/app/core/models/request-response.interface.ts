export interface GetTrafficImgRequest {
    date_time: string;
}

export interface GetTrafficImgResponse {
    api_info: ApiInfo;
    items: Item[];
}

export interface GetWeatherForecastRequest {
    area_metadata: string;
    date_time: string;
    date?: string;
}

export interface GetWeatherForecastResponse {
    api_info: ApiInfo;
    area_metadata: AreaMetadata[];
    items: Item[];
}

interface ApiInfo {
    status: string;
}

interface ImageMetadata {
    height: number;
    width: number;
    md5: string;
}

interface Camera {
    timestamp: Date;
    camera_id: number;
    image_id: number;
    image: string;
    image_metadata: ImageMetadata;
}

interface Item {
    timestamp: Date;
    cameras: Camera[];
}

interface AreaMetadata {
    name: string;
    label_location: LabelLocation;
}

interface LabelLocation {
    longitude: number;
    latitude: number;
}
