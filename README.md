# Nubila 프로젝트 [![Build Status](https://app.travis-ci.com/dnjsrud3407/nubilaProject.svg?branch=main)](https://app.travis-ci.com/dnjsrud3407/nubilaProject)

## 프로젝트 소개

탄소 중립 실현을 위한 지역 시민들의 관심을 독려하고자 합니다.
이를 위해 누구나 실생활에서 편리하게 사용할 수 있으며, 더불어 환경 개선에 참여할 수 있는 공영 자전거 시스템을 활용하자는 아이디어를 떠올렸습니다.
누비라는 창원시가 운영하는 공영 자전거인 누비자 사용 편의를 개선하는 서비스를 제공합니다.

## 개발 환경

- 스프링부트 2.5.3, Gradle, Java 11
- HTML, CSS, JS, JQuery, Thymeleaf
- Git, Github
- travis CI, AWS EC2, AWS S3, AWS CodeDeploy
- Nubija API, Tmap API, CKEditor

## 주요 기능

프로젝트 주요기능은 정류소, 길 찾기, 즐겨찾기, 회원 서비스, 관리자 서비스, 공지 및 문의하기 입니다.

1. 정류소 찾기
   사용자가 장소, 정류소를 검색창에 입력하여 주변 정류소 5곳을 찾아주는 기능입니다. 실시간으로 대여가능한 자전거 수, 빈 보관대 수를 확인할 수 있습니다. 또한 자주 사용하는 정류소를 즐겨찾기에 추가하여 편리하게 조회할 수 있습니다.

2. 길찾기
   사용자가 출발지, 도착지를 검색창에 입력하여 최단거리 경로를 찾아주는 기능입니다. 실시간으로 대여가능한 자전거가 있는 정류소를 경유하여 최단거리 경로를 검색할 수 있습니다. 자주 사용하는 길찾기 경로를 즐겨찾기에 추가하여 편리하게 조회할 수 있습니다.

3. 즐겨찾기
   자주 사용하는 정류소, 길 찾기를 즐겨찾기에 추가하여 간편하게 정류소 실시간 현황을 확인할 수 있습니다.

4. 회원 서비스
   회원 서비스에는 회원가입, 로그인, 회원수정, 회원탈퇴 기능이 있습니다. 회원수정과 회원탈퇴 시 이메일로 인증하여 진행하도록 구현하였습니다.

5. 공지사항, 문의사항
   등록된 공지사항을 확인하는 기능과 사용자가 문의사항을 등록 및 수정할 수 있습니다.

6. 관리자 서비스
   공지사항 관리와 문의사항 답변 등록이 가능합니다. 또한 전체 회원정보를 확인할 수 있습니다.

## 시연 영상

[유튜브에서 확인하기](https://youtu.be/ihSPjcd_7fM)

<img title="main" src="https://user-images.githubusercontent.com/62924471/132990831-a911da7b-6177-4a69-a00c-1bebea4ba4b8.gif" width="700px">
<img title="join" src="https://user-images.githubusercontent.com/62924471/132990980-c990eafb-d9f7-4f1d-9b87-a4b45f4a5c36.gif" width="700px">
<img title="login" src="https://user-images.githubusercontent.com/62924471/132991673-c8b184aa-2b11-4281-8a09-419a1a69d239.gif" width="700px">
<img title="search" src="https://user-images.githubusercontent.com/62924471/132991423-4ee0b027-a839-4aca-8ccf-4338dd271995.gif" width="700px">
<img title="mypage" src="https://user-images.githubusercontent.com/62924471/132990988-5c0aa2f5-2098-48c4-b132-51a957059ae3.gif" width="700px">
<img title="support" src="https://user-images.githubusercontent.com/62924471/132991436-55a0322a-d36c-44dd-9e25-a95e6e8bafb4.gif" width="700px">
<img title="admin" src="https://user-images.githubusercontent.com/62924471/132991511-d528d43b-9390-49a1-9e52-56334ed30d7d.gif" width="700px">
