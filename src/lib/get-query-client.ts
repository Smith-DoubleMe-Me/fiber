import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";

/**
 * 요청당 단일 QueryClient 인스턴스를 유지하면서 사용자와 요청 간에 데이터가 격리된 상태로 유지되도록 보장하기 위해 QueryClient의 요청 범위 싱글톤 인스턴스를 생성
 * 구성 요소 트리 전체에서 모든 구성 요소가 미리 가져온 쿼리에 액세스
 *  <Hydrate>를 활용
 */
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
