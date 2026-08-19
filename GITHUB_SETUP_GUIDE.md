# 🚀 GitHub 계정 생성 & 배포 완전 가이드

> 처음 GitHub를 사용하는 분을 위한 단계별 가이드

---

## 📋 목차

1. [GitHub 계정 생성](#step-1-github-계정-생성)
2. [Git 설치 확인](#step-2-git-설치-확인)
3. [Git 초기 설정](#step-3-git-초기-설정)
4. [GitHub 인증 설정](#step-4-github-인증-설정)
5. [GitHub 저장소 생성](#step-5-github-저장소-생성)
6. [코드 업로드](#step-6-코드-업로드)
7. [GitHub Pages 활성화](#step-7-github-pages-활성화)
8. [배포 확인](#step-8-배포-확인)
9. [트러블슈팅](#트러블슈팅)

**예상 소요 시간:** 15~20분 (처음 한 번만)

---

## Step 1: GitHub 계정 생성

### 1. GitHub 웹사이트 접속

브라우저에서 https://github.com 열기

### 2. Sign Up 클릭

우측 상단의 **Sign up** 버튼 클릭

### 3. 계정 정보 입력

| 항목 | 설명 | 예시 |
|------|------|------|
| **Email** | 이메일 주소 | emilio@example.com |
| **Password** | 비밀번호 (15자 이상 권장) | MySecurePass123! |
| **Username** | 사용자명 (URL에 사용됨) | emilio-dev |

**Username 주의사항:**
- 3~39자
- 영문, 숫자, 하이픈(-) 가능
- 시작/끝은 영문 또는 숫자
- 나중에 변경 가능하지만 URL이 바뀜

### 4. 이메일 인증

1. GitHub에서 보낸 인증 메일 확인
2. 인증 링크 클릭 또는 코드 입력
3. 완료!

### 5. 플랜 선택

**Free** 선택 (무료 플랜으로 충분합니다)

**Free 플랜 포함 내용:**
- ✅ 무제한 public/private 저장소
- ✅ GitHub Pages (무료 호스팅)
- ✅ GitHub Actions (월 2,000분)
- ✅ 협업 기능

---

## Step 2: Git 설치 확인

### 터미널에서 확인

```bash
git --version
```

**예상 출력:**
```
git version 2.39.0 (또는 다른 버전)
```

### Git이 없다면 설치

**macOS:**
```bash
xcode-select --install
```

**설치 확인:**
```bash
git --version
```

---

## Step 3: Git 초기 설정

### 사용자 정보 설정 (최초 1회만)

```bash
# GitHub username으로 설정
git config --global user.name "your-github-username"

# GitHub 가입 이메일로 설정
git config --global user.email "your-email@example.com"
```

**예시:**
```bash
git config --global user.name "emilio-dev"
git config --global user.email "emilio@example.com"
```

### 설정 확인

```bash
git config --global --list
```

**예상 출력:**
```
user.name=emilio-dev
user.email=emilio@example.com
```

---

## Step 4: GitHub 인증 설정

GitHub에 코드를 업로드하려면 **인증**이 필요합니다.

### 방법 A: Personal Access Token (추천)

가장 쉽고 안전한 방법입니다.

#### 1. Token 생성하기

**브라우저에서 GitHub 로그인 후:**

1. 우측 상단 프로필 사진 클릭
2. **Settings** 클릭
3. 좌측 맨 아래 **Developer settings** 클릭
4. **Personal access tokens** → **Tokens (classic)** 클릭
5. **Generate new token** → **Generate new token (classic)** 클릭

#### 2. Token 설정하기

| 항목             | 설정                               |
| -------------- | -------------------------------- |
| **Note**       | `lingotype-deploy` (용도 메모) |
| **Expiration** | `90 days` (또는 원하는 기간)            |
| **Scopes**     | 아래 항목 체크                         |

**체크할 Scopes:**
- ✅ **repo** (전체 - 저장소 접근)
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events
- ✅ **workflow** (GitHub Actions)

#### 3. Token 생성 및 저장

1. 페이지 하단 **Generate token** 클릭
2. 생성된 Token 복사 (예: `ghp_abcdef1234567890...`)
3. **⚠️ 중요: 안전한 곳에 저장** (다시 볼 수 없음!)

**Token 저장 예시:**
```
메모장이나 비밀번호 관리자에 저장:

GitHub Token (lingotype-deploy)
ghp_abcdef1234567890abcdef1234567890abcd
생성일: 2026-06-18
만료일: 2026-09-16
```

#### 4. Token 사용 방법

나중에 `git push` 할 때:
```
Username: your-github-username
Password: ghp_abcdef1234567890... (Token 붙여넣기)
```

**macOS에서는 자동으로 Keychain에 저장됩니다** (다음부터 입력 불필요)

---

### 방법 B: SSH Key (선택사항 - 고급)

더 안전하지만 설정이 복잡합니다. Token으로 충분하다면 건너뛰세요.

<details>
<summary>SSH Key 설정 방법 보기 (클릭)</summary>

#### 1. SSH Key 생성

```bash
# SSH 키 생성 (이메일은 GitHub 가입 이메일)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 질문이 나오면 모두 Enter (기본값 사용)
Enter file: (Enter)
Enter passphrase: (Enter)
Enter same passphrase: (Enter)
```

#### 2. 공개키 복사

```bash
# macOS
cat ~/.ssh/id_ed25519.pub | pbcopy

# 또는 직접 출력하여 복사
cat ~/.ssh/id_ed25519.pub
```

**출력 예시:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAbcdef... your-email@example.com
```

#### 3. GitHub에 SSH Key 등록

1. GitHub → 프로필 → **Settings**
2. 좌측 **SSH and GPG keys**
3. **New SSH key** 클릭
4. 입력:
   - Title: `My Mac` (또는 컴퓨터 이름)
   - Key: (복사한 공개키 붙여넣기)
5. **Add SSH key** 클릭
6. 비밀번호 확인

#### 4. 연결 테스트

```bash
ssh -T git@github.com
```

**예상 출력:**
```
Hi your-username! You've successfully authenticated...
```

</details>

---

## Step 5: GitHub 저장소 생성

### 1. 새 저장소 생성 페이지

브라우저에서 https://github.com/new 열기

### 2. 저장소 정보 입력

| 항목                        | 설정                                       | 설명                      |
| ------------------------- | ---------------------------------------- | ----------------------- |
| **Repository name**       | `lingotype`                        | URL에 사용됨                |
| **Description**           | `🌍 Multi-language typing practice game` | 선택사항                    |
| **Public/Private**        | **Public** 선택                            | GitHub Pages는 Public 필요 |
| **Initialize repository** | ❌ 모두 체크 해제                               | 이미 로컬에 파일 있음            |

**체크 해제 필수:**
- ❌ Add a README file
- ❌ Add .gitignore
- ❌ Choose a license

### 3. Create repository 클릭

### 4. 저장소 URL 확인

생성 완료 후 URL 표시됨:

**HTTPS (Token 사용):**
```
https://github.com/your-username/lingotype.git
```

**SSH (SSH Key 사용):**
```
git@github.com:your-username/lingotype.git
```

**본인의 URL을 메모해두세요!**

---

## Step 6: 코드 업로드

### 1. 프로젝트 디렉토리로 이동

```bash
cd /Users/emilio/projects/Projects/Game/lingotype
```

### 2. Git 저장소 초기화

```bash
git init
```

**예상 출력:**
```
Initialized empty Git repository in /Users/emilio/projects/Projects/Game/lingotype/.git/
```

### 3. 모든 파일 추가

```bash
git add .
```

**설명:** 모든 파일을 Git 추적 대상에 추가

### 4. 첫 커밋 생성

```bash
git commit -m "feat: complete alpha build - 4 languages, 30+ stages, 106 tests"
```

**예상 출력:**
```
[main (root-commit) abc1234] feat: complete alpha build...
 XXX files changed, XXXXX insertions(+)
 create mode 100644 README.md
 ...
```

### 5. 브랜치 이름 설정

```bash
git branch -M main
```

**설명:** 기본 브랜치를 `main`으로 설정 (GitHub 표준)

### 6. 원격 저장소 연결

**⚠️ 본인의 username을 넣으세요!**

```bash
# HTTPS 사용 (Token)
git remote add origin https://github.com/your-username/lingotype.git

# 또는 SSH 사용 (SSH Key)
git remote add origin git@github.com:your-username/lingotype.git
```

**예시:**
```bash
git remote add origin https://github.com/emilio-dev/lingotype.git
```

### 7. 원격 저장소 확인

```bash
git remote -v
```

**예상 출력:**
```
origin  https://github.com/your-username/lingotype.git (fetch)
origin  https://github.com/your-username/lingotype.git (push)
```

### 8. 코드 푸시 (업로드)

```bash
git push -u origin main
```

**Token 인증 (HTTPS 사용 시):**
```
Username for 'https://github.com': your-username
Password for 'https://your-username@github.com': ghp_your_token_here
```

**예상 출력:**
```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
...
To https://github.com/your-username/lingotype.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**✅ 완료!** GitHub에 코드가 업로드되었습니다!

### 9. 업로드 확인

브라우저에서 확인:
```
https://github.com/your-username/lingotype
```

파일 목록이 보이면 성공! 🎉

---

## Step 7: GitHub Pages 활성화

### 1. 저장소 Settings로 이동

브라우저에서:
```
https://github.com/your-username/lingotype/settings
```

또는:
1. 저장소 페이지 → 상단 **Settings** 탭 클릭

### 2. Pages 메뉴로 이동

1. 좌측 메뉴에서 **Pages** 클릭 (하단 근처)

### 3. Build and deployment 설정

| 항목 | 설정 |
|------|------|
| **Source** | **GitHub Actions** 선택 |

**⚠️ 중요:** "Deploy from a branch"가 아닌 **"GitHub Actions"** 선택!

### 4. 설정 저장

자동으로 저장됨 (Save 버튼 없음)

### 5. 자동 배포 시작

GitHub Actions가 자동으로:
1. 의존성 설치 (`npm ci`)
2. 테스트 실행 (`npm test`)
3. 빌드 실행 (`npm run build`)
4. GitHub Pages 배포

**배포 진행 확인:**
```
https://github.com/your-username/lingotype/actions
```

**배포 시간:** 약 2~3분

---

## Step 8: 배포 확인

### 1. Actions 탭에서 진행 상황 확인

1. 저장소 페이지 → **Actions** 탭
2. 최신 워크플로우 확인 (초록색 체크 = 성공)

### 2. 배포 URL 확인

**URL 형식:**
```
https://your-username.github.io/lingotype/
```

**예시:**
```
https://emilio-dev.github.io/lingotype/
```

### 3. 사이트 접속

브라우저에서 위 URL 열기

**확인 사항:**
- [ ] 메인 화면 로딩
- [ ] 4개 언어 섹션 표시
- [ ] 튜토리얼 작동
- [ ] 스테이지 선택 가능
- [ ] 타이핑 게임 플레이 가능

### 4. README 업데이트

실제 URL로 업데이트:

**파일:** `README.md` 및 `prototype/README.md`

**변경 전:**
```markdown
**🎮 [Play Live Demo](https://yourusername.github.io/lingotype/)** *(배포 후 업데이트 필요)*
```

**변경 후:**
```markdown
**🎮 [Play Live Demo](https://your-actual-username.github.io/lingotype/)**
```

**변경사항 푸시:**
```bash
git add README.md prototype/README.md
git commit -m "docs: update live demo URL"
git push
```

---

## 🎉 완료!

**축하합니다!** LingoType가 성공적으로 배포되었습니다!

### 다음 단계

1. **공유하기**
   - Twitter: #TypingLanguage #GameDev
   - Reddit: r/gamedev, r/languagelearning
   - Discord: 언어 학습 커뮤니티

2. **피드백 수집**
   - 친구/동료에게 테스트 요청
   - GitHub Issues 활성화

3. **지속 개발**
   - 버그 수정
   - 새 기능 추가
   - 새 언어 추가

### 다음 배포는 더 쉽습니다!

코드 수정 후:
```bash
git add .
git commit -m "fix: bug fix description"
git push
```

**GitHub Actions가 자동으로 배포합니다!** 🚀

---

## 트러블슈팅

### 문제 1: `git push` 시 인증 실패

**증상:**
```
remote: Invalid username or password.
fatal: Authentication failed
```

**해결:**
1. Username 확인 (GitHub username)
2. Password는 Token 사용 (계정 비밀번호 아님!)
3. Token 재생성 (만료되었을 수 있음)

---

### 문제 2: GitHub Pages가 404 에러

**증상:**
배포 URL에 접속하면 "404 Not Found"

**해결:**
1. Actions 탭에서 배포 성공 확인 (초록색 체크)
2. Settings → Pages에서 Source가 "GitHub Actions"인지 확인
3. 5~10분 대기 (최초 배포는 시간 소요)
4. 브라우저 캐시 삭제 후 재시도

---

### 문제 3: Actions 워크플로우 실패

**증상:**
Actions 탭에서 빨간색 X 표시

**해결:**
1. 실패한 워크플로우 클릭
2. 에러 로그 확인
3. 주로 원인:
   - 테스트 실패 → `npm test` 로컬에서 확인
   - 빌드 실패 → `npm run build` 로컬에서 확인
   - Node 버전 → `.github/workflows/deploy.yml`에서 버전 확인

---

### 문제 4: Token을 잃어버렸어요

**해결:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. 기존 Token 삭제
3. 새 Token 생성 (Step 4 참고)
4. 다음 `git push` 시 새 Token 사용

**macOS Keychain에서 삭제:**
```bash
# Keychain에 저장된 인증 정보 삭제
git credential-osxkeychain erase
host=github.com
protocol=https

# Enter 두 번
```

---

### 문제 5: `git add .` 시 너무 많은 파일

**증상:**
```
warning: adding embedded git repository: node_modules/...
```

**해결:**
`.gitignore` 파일 확인:

```bash
cat prototype/.gitignore
```

**있어야 할 내용:**
```
node_modules/
dist/
.DS_Store
*.log
```

**없다면 생성:**
```bash
echo "node_modules/
dist/
.DS_Store
*.log" > prototype/.gitignore

git add .gitignore
git commit -m "chore: add .gitignore"
```

---

### 문제 6: 푸시 속도가 느려요

**원인:** 파일 크기가 큼 (node_modules 포함?)

**해결:**
```bash
# 캐시 제거
git rm -r --cached .
git add .
git commit -m "chore: clean up ignored files"
git push
```

---

## 📞 추가 도움말

### GitHub 공식 문서
- https://docs.github.com/en/get-started

### Git 기본 명령어
- https://git-scm.com/docs

### GitHub Pages 문서
- https://docs.github.com/en/pages

---

## 📝 체크리스트

배포 전 최종 확인:

- [ ] GitHub 계정 생성
- [ ] Git 설치 확인
- [ ] Git 사용자 정보 설정
- [ ] Personal Access Token 생성 및 저장
- [ ] GitHub 저장소 생성
- [ ] 로컬 저장소 초기화 (`git init`)
- [ ] 파일 커밋 (`git commit`)
- [ ] 원격 저장소 연결 (`git remote add`)
- [ ] 코드 푸시 (`git push`)
- [ ] GitHub Pages 활성화
- [ ] 배포 URL 접속 확인
- [ ] README에 실제 URL 업데이트

---

**Happy Deploying! 🚀**

이 가이드를 따라하시면서 문제가 생기면, 에러 메시지와 함께 질문해주세요!
