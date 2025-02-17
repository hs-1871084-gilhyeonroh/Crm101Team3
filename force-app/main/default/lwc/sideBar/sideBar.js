import { LightningElement, track } from 'lwc';

export default class SidebarComponent extends LightningElement {
    @track isSidebarOpen = false;

    connectedCallback() {
        // 화면 어디를 클릭해도 Sidebar가 열리도록 이벤트 리스너 추가
        document.addEventListener('click', this.handlePageClick);
    }

    disconnectedCallback() {
        // 컴포넌트가 제거될 때 이벤트 리스너 해제
        document.removeEventListener('click', this.handlePageClick);
    }

    handlePageClick = (event) => {
        // Sidebar 내부 클릭이면 열지 않음
        if (this.template.contains(event.target)) {
            return;
        }
        this.openSidebar();
    };

    openSidebar() {
        this.isSidebarOpen = true;
    }

    closeSidebar() {
        // 닫기 애니메이션 적용 후 상태 변경
        const sidebar = this.template.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('slide-out'); // 닫힐 때 오른쪽으로 이동
            setTimeout(() => {
                this.isSidebarOpen = false;
                sidebar.classList.remove('slide-out'); // 클래스 초기화
            }, 300); // 애니메이션 시간 후 상태 변경
        }
    }
}
