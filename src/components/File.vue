<script setup>

</script>

<template>
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box max-w-7xl pt-8">
      <div class="overflow-x-auto space-y-4">
        <div class="flex items-center justify-between px-4 font-semibold">
          <p>ჯამური თანხა - {{ amount }}</p>
          <p>ჩანაწერი - {{ total }}</p>
          <p>უხარვეზო - {{ ok }}</p>
          <p>დახარვეზებული - {{ warning }}</p>
        </div>
        <div class="flex gap-x-16">
          <table class="table w-3/4 min-h-[62vh]">
            <thead>
            <tr>
              <th>თარიღი</th>
              <th>სრული თანხა</th>
              <th>მიზანი</th>
              <th>აღწერა</th>
              <th>სტატუსი</th>
            </tr>
            </thead>
            <tbody v-if="sheet && sheet.length > 0">
            <tr v-for="(extraction, index) in sheet" :key="index">
              <td v-text="extraction.date"/>
              <td v-text="extraction.totalAmount"/>
              <td v-text="extraction.purpose"/>
              <td v-text="extraction.description"/>
              <td>
                <img src="/src/assets/check_circle.svg" alt="check icon" v-if="extraction.status === 'GOOD'"/>
                <img src="/src/assets/warning.svg" alt="warning icon" v-else/>
              </td>
            </tr>
            </tbody>

            <tbody v-else-if="sheet && sheet.length === 0">
            <tr>
              <td>
                ჩანაწერები ვერ მოიძებნა!
              </td>
            </tr>
            </tbody>

            <tbody v-else>
            <tr>
              <td class="flex items-center gap-x-2.5">
                იტვირთება <span class="loading loading-spinner loading-md"/>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="flex flex-col gap-y-10 font-medium">
            <div class="flex flex-col gap-y-2.5">
              <p>თარიღი</p>

              <div class="flex flex-col gap-y-2">
                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="startDate"/>
                  <span class="text-xs">დან</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="date" class="text-sm" v-model="endDate"/>
                  <span class="text-xs">მდე</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>თანხა</p>

              <input
                  type="text"
                  v-model="filter_amount"
                  placeholder="შეიყვანეთ თანხა"
                  class="input input-bordered input-xs w-full max-w-xs focus:outline-none"/>
            </div>

            <div class="flex flex-col gap-y-2">
              <p>სტატუსი</p>

              <div class="flex flex-col gap-y-2.5">
                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="" class="radio radio-xs focus:outline-none"
                         checked="checked" v-model="status"/>
                  <span class="text-xs">ერთად</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="ok" class="radio radio-xs focus:outline-none"
                         v-model="status"/>
                  <span class="text-xs">უხარვეზო</span>
                </div>

                <div class="flex items-center gap-x-2">
                  <input type="radio" name="radio" value="warn" class="radio radio-xs focus:outline-none"
                         v-model="status"/>
                  <span class="text-xs">დახარვეზებული</span>
                </div>
              </div>
            </div>

            <button class="btn btn-neutral btn-sm"
                    @click="startDate = null; endDate = null; filter_amount = null; status = ''">გასუფთავება
            </button>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <div class="join justify-center w-full">
          <button class="join-item btn" @click="
            _currentPage = _currentPage - 1;
          fetchSheetData();
          " :disabled="_currentPage === 1">
            «
          </button>
          <button class="join-item btn focus:outline-0">
            {{ _currentPage }}
          </button>
          <button class="join-item btn" @click="
            _currentPage = _currentPage + 1;
          fetchSheetData();
          " :disabled="_currentPage === _totalPages">
            »
          </button>
        </div>
        <form method="dialog"
              @submit="_currentPage=1; sheet = null; startDate = null; endDate = null; filter_amount = null; status = ''">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form method="dialog"
              @submit="_currentPage=1; sheet = null;startDate = null; endDate = null; filter_amount = null; status = null">
          <button class="btn">დახურვა</button>
        </form>
      </div>
    </div>
  </dialog>
</template>